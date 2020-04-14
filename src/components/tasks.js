import {getElement} from "../utils.js";

export default class Tasks {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }

  getTasksElement() {
    if (!this._element) {
      this._element = getElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
