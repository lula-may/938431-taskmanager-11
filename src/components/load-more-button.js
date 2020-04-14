import {getElement} from "../utils.js";

export default class LoadMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }

  getMoreButtonElement() {
    if (!this._element) {
      this._element = getElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
