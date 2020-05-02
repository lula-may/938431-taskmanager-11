import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {getTasksByFilter} from "../utils/filter.js";
import {render, replace} from "../utils/render.js";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._tasksModel.setDataChangeHandlers(this._onDataChange);
  }

  render() {
    const allTasks = this._tasksModel.getTasksAll();
    const filters = this._getFilters(allTasks);
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  setActiveFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterComponent.updateActiveItem(filterType);
  }

  _getFilters(tasks) {
    return Object.values(FilterType).map((name) => {
      return {
        name,
        count: getTasksByFilter(tasks, name).length,
        checked: name === this._activeFilterType,
      };
    });
  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
