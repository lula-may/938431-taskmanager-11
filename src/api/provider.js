import TaskModel from "../models/task.js";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.forEach((task) => this._store.setItem(task.id, task.convertToRaw()));
          return tasks;
        });
    }
    const storedTasks = Object.values(this._store.getItems());
    return Promise.resolve(TaskModel.parseTasks(storedTasks));
  }

  updateTask(id, task) {
    if (this._isOnline()) {
      return this._api.updateTask(id, task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.convertToRaw());
          return newTask;
        });
    }
    const localTask = TaskModel.clone(Object.assign(task, {id}));
    this._store.setItem(id, localTask.convertToRaw());
    return Promise.resolve(localTask);
  }

  createTask(data) {
    if (this._isOnline()) {
      return this._api.createTask(data);
    }
    return Promise.reject(`Offline logic is not implemented`);
  }

  deleteTask(id) {
    if (this._isOnline()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }
    this._store.removeItem(id);
    return Promise.resolve();
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
