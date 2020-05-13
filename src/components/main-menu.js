import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  NEW_TASK: `control__new-task`,
  STATISTICS: `control__statistic`,
  TASKS: `control__task`,
};

const getMainMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        class="control__input visually-hidden"
      />
      <label for="control__new-task" class="control__label control__label--new-task">
        + ADD NEW TASK
      </label>
      <input
        type="radio"
        name="control"
        id="control__task"
        class="control__input visually-hidden"
        checked
      />
      <label for="control__task" class="control__label">TASKS</label>
      <input
        type="radio"
        name="control"
        id="control__statistic"
        class="control__input visually-hidden"
      />
      <label for="control__statistic" class="control__label">STATISTICS</label>
    </section>`
  );
};

export default class MainMenu extends AbstractComponent {
  getTemplate() {
    return getMainMenuTemplate();
  }

  setActiveItem(itemId) {
    const activeItem = this.getElement().querySelector(`#${itemId}`);
    if (activeItem) {
      activeItem.checked = true;
    }
  }

  setOnChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      const item = evt.target.id;
      handler(item);
    });
  }
}
