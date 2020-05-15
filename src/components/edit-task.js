import {formatTime, formatDate, isRepeating, isOverDue} from "../utils/common.js";
import {COLORS, DAYS} from "../const.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {encode} from "he";

const DESCRIPTION_LENGTH = {
  MIN: 1,
  MAX: 140,
};

const DefaultData = {
  saveButtonText: `Save`,
  deleteButtonText: `Delete`,
  isSaveButtonBlocked: false,
  isDeleteButtonBlocked: false
};

const createRepeatingDaysMarkup = (days, repeatingDays, id) => {
  return days
    .map((day) => {
      const isRepeatingDay = repeatingDays[day];
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${id}"
          name="repeat"
          value="${day}"
          ${isRepeatingDay ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-${id}">
          ${day}
        </label>`
      );
    })
    .join(`\n`);
};

const createColorsMarkup = (colors, currentColor, id) => {
  return colors
    .map((color) => {
      return (
        `<input
        type="radio"
        id="color-${color}--${id}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${color === currentColor ? `checked` : ``}
      />
      <label
        for="color-${color}--${id}"
        class="card__color card__color--${color}"
      >black
      </label>`
      );
    })
    .join(`\n`);
};

const getEditTaskTemplate = (options = {}) => {
  const {id, color, dueDate, isDateShowing, isRepeatingTask, activeRepeatingDays, currentDescription, externalData} = options;
  const description = encode(currentDescription);
  const isExpired = isOverDue(dueDate);
  const date = (isDateShowing && dueDate) ? `${formatDate(dueDate)}` : ``;
  const time = (isDateShowing && dueDate) ? `${formatTime(dueDate)}` : ``;
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays, id);
  const colorsMarkup = createColorsMarkup(COLORS, color, id);
  const saveButtonText = externalData.saveButtonText;
  const deleteButtonText = externalData.deleteButtonText;
  const isFormDataInvalid = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays));
  const isSaveButtonBlocked = externalData.isSaveButtonBlocked || isFormDataInvalid;
  const isDeleteButtonBlocked = externalData.isDeleteButtonBlocked;

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
                minlength="${DESCRIPTION_LENGTH.MIN}"
                maxlength="${DESCRIPTION_LENGTH.MAX}"
                required
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                ${isDateShowing ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `YES` : `NO`}</span>
                </button>
                ${isRepeatingTask ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                  ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isSaveButtonBlocked ? `disabled` : ``}>${saveButtonText}</button>
            <button class="card__delete" type="button" ${isDeleteButtonBlocked ? `disabled` : ``}>${deleteButtonText}</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class EditTask extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._id = task.id ? task.id : `new`;
    this._color = task.color;
    this._currentDescription = task.description;
    this._dueDate = task.dueDate;
    this._isDateShowing = !!task.dueDate;
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._isRepeatingTask = isRepeating(task.repeatingDays);
    this._externalData = DefaultData;
    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return getEditTaskTemplate({
      id: this._id,
      color: this._color,
      dueDate: this._dueDate,
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
      currentDescription: this._currentDescription,
      externalData: this._externalData
    });
  }

  setEditFormSubmitHandler(handler) {
    const editForm = this.getElement().querySelector(`.card__form`);
    editForm.addEventListener(`submit`, handler);
    // Запоминаем обработчик для последующего восстановления
    this._submitHandler = handler;
  }

  getData() {
    const editForm = this.getElement().querySelector(`.card__form`);
    return new FormData(editForm);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, handler);
    this._deleteHandler = handler;
  }

  reset() {
    const task = this._task;
    this._color = task.color;
    this._currentDescription = task.description;
    this._dueDate = task.dueDate;
    this._isDateShowing = !!task.dueDate;
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._isRepeatingTask = isRepeating(task.repeatingDays);
    this.rerender();
  }

  remove() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    super.removeElement();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  setExternalData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  _applyFlatpickr() {
    // Если есть ранее созданный экземпляр flatpickr - удаляем его
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    // Создаем новый экземпляр flatpickr и вешаем его на поле Даты, если у задачи есть срок выполнения
    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._dueDate || `today`,
        onChange: (days) => {
          this._dueDate = days[0];
          this.rerender();
        }
      });
    }
  }

  recoveryListeners() {
    this.setEditFormSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteHandler);
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const textElement = element.querySelector(`.card__text`);
    textElement.addEventListener(`input`, (evt) => {

      this._currentDescription = evt.target.value;
      const saveButton = element.querySelector(`.card__save`);
      saveButton.disabled = !textElement.checkValidity();
    });

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;
        if (!this._isDateShowing) {
          this._dueDate = null;
        }
        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;
        this.rerender();
      });

    const repeatDaysFieldset = element.querySelector(`.card__repeat-days`);
    if (repeatDaysFieldset) {
      repeatDaysFieldset.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }

    const colorBar = element.querySelector(`.card__colors-wrap`);
    colorBar.addEventListener(`change`, (evt) => {
      evt.stopPropagation();
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._color = evt.target.value;
      this.rerender();
    });
  }
}
