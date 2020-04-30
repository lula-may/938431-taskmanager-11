import {FilterType} from "../const";
import {getTasksByFilter} from "../utils/filter";

export default class Tasks {
  constructor() {
    this._tasks = [];
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._activeFilter = FilterType.ALL;
  }

  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilter);
  }

  getTasksAll() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateTask(id, task) {
    const index = this._tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandlers(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilter = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
