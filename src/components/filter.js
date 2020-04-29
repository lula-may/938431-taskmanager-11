import AbstractComponent from "./abstract-component.js";
const FILTER_PREFIX = `filter__`;

const getFilterNameById = (id) => id.replace(FILTER_PREFIX, ``);

const getfilterMarkup = (filter) => {
  const {name, count, checked} = filter;
  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${checked ? `checked` : ``}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

const getFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item) => getfilterMarkup(item, item.checked))
  .join(`\n`);
  return (
    `<section class="main__filter filter container">
    ${filtersMarkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return getFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
