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
export const getFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => getfilterMarkup(item, i === 0))
  .join(`\n`);
  return (
    `<section class="main__filter filter container">
    ${filtersMarkup}
    </section>`
  );
};
