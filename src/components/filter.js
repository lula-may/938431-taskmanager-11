import {getElement} from "../utils.js";

const getfilterMarkup = (filter) => {
  const {title, count, isDefault} = filter;
  return (
    `<input
      type="radio"
      id="filter__${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${isDefault ? `checked` : ``}
    />
    <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span></label
    >`
  );
};

const getFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => getfilterMarkup(item, i === 0))
  .join(`\n`);
  return (
    `<section class="main__filter filter container">
    ${filtersMarkup}
    </section>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return getFilterTemplate(this._filters);
  }

  getFilterElement() {
    if (!this._element) {
      this._element = getElement(this._filters);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
