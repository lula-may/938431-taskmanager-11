import AbstractComponent from "./abstract-component.js";

const SortType = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`,
};

const sortNames = Object.values(SortType);
const getSortString = (sortName) => {
  const words = sortName.split(`-`);
  words[0] = words[0].toUpperCase();
  return words.join(` `);
};

const SortListString = sortNames.map((name) => {
  return `<a href="#" class="board__filter" data-sort-type="${name}">SORT BY ${getSortString(name)}</a>`;
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
    this._sortType = sortType;
  }
}

export {SortType};
