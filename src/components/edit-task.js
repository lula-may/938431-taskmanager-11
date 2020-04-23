import {formatTime} from "../utils/common.js";
import {COLORS, DAYS} from "../const.js";
import AbstractSmartComponent from "./abstract-smart-component.js";

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days
    .map((day, index) => {
      const isRepeating = repeatingDays[day];
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${index}"
          name="repeat"
          value="${day}"
          ${isRepeating ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-${index}">
          ${day}
        </label>`
      );
    })
    .join(`\n`);
};

const createColorsMarkup = (colors, currentColor) => {
  return colors
    .map((color, index) => {
      return (
        `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${color === currentColor ? `checked` : ``}
      />
      <label
        for="color-${color}-${index}"
        class="card__color card__color--${color}"
      >black
      </label>`
      );
    })
    .join(`\n`);
};

const getEditTaskTemplate = (task, options = {}) => {
  const {description, dueDate, repeatingDays, color} = task;
  const {isDateShowing, isRepeatingTask} = options;
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const date = (isDateShowing && dueDate) ? `${dueDate.toLocaleString(`en-GB`, {day: `numeric`, month: `long`})}` : ``;
  const time = (isDateShowing && dueDate) ? `${formatTime(dueDate)}` : ``;
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);
  const colorsMarkup = createColorsMarkup(COLORS, color);

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
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
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
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).includes(true);
    this._submitHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return getEditTaskTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
    });
  }

  setEditFormSubmitHandler(handler) {
    const editForm = this.getElement().querySelector(`.card__form`);
    editForm.addEventListener(`submit`, handler);
    // Запоминаем обработчик для последующего восстановления
    this._submitHandler = handler;
  }

  recoveryListeners() {
    this.setEditFormSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;
        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;
        this.rerender();
      });

  }
}
