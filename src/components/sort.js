import AbstractComponent from "./abstract-component.js";
import {SortType} from "../const.js";

const SortListString = Object.values(SortType).map((type) => {
  return `<a href="#" class="board__filter" data-sort-type="${type}">SORT BY ${type}</a>`;
})
  .join(`\n`);

const getSortingTemplate = () => {
  return (
    `<div class="board__filter-list">
      ${SortListString}
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }
  getTemplate() {
    return getSortingTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      if (sortType === this._currentSortType) {
        return;
      }

      this._currentSortType = sortType;
      handler(sortType);
    });
  }

  setSortType(sortType) {
    this._currentSortType = sortType;
  }
}
