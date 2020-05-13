import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace} from "../utils/render.js";
import {isRepeating, isToday} from "../utils/common.js";

const getOverdueTasks = (tasks) => {
  return tasks.filter((task) => {
    return task.dueDate && task.dueDate < Date.now();
  });
};

const getTodayTasks = (tasks) => {
  return tasks.filter((task) => isToday(task.dueDate));
};

const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksByFilter = (tasks, filterName) => {
  switch (filterName) {
    case FilterType.ALL: return getNotArchiveTasks(tasks);
    case FilterType.OVERDUE: return getOverdueTasks(tasks);
    case FilterType.TODAY: return getTodayTasks(tasks);
    case FilterType.FAVORITES: return getFavoriteTasks(tasks);
    case FilterType.REPEATING: return getRepeatingTasks(tasks);
    case FilterType.ARCHIVE: return getArchiveTasks(tasks);
    default: return tasks;
  }
};

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
