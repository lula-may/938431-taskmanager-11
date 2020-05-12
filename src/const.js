const COLORS = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
];

const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`,
};

const SortType = {
  DEFAULT: `DEFAULT`,
  DATE_UP: `DATE up`,
  DATE_DOWN: `DATE down`,
};


export {COLORS, DAYS, MONTH_NAMES, FilterType, SortType};
