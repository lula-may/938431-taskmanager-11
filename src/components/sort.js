import AbstractComponent from "./abstract-component.js";

const SortType = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`,
};

const getSortingTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
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
      console.log(`Новый тип сортировки: ${sortType}`);
      handler(sortType);
    });
  }

  setSortType(sortType) {
    this._sortType = sortType;
  }
}
