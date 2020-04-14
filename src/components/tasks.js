import {createElement} from "../utils.js";

export default class Tasks {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
