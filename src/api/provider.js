import TaskModel from "../models/task.js";

const isOnline = () => window.navigator.onLine;

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.forEach((task) => this._store.setItem(task.id, task.convertToRaw()));
          return tasks;
        });
    }
    const storedTasks = Object.values(this._store.getItems());
    return Promise.resolve(TaskModel.parseTasks(storedTasks));
  }

  updateTasks(id, data) {
    if (isOnline()) {
      return this._api.updateTasks(id, data);
    }
    return Promise.reject(`Offline logic is not implemented`);
  }

  createTask(data) {
    if (isOnline()) {
      return this._api.createTask(data);
    }
    return Promise.reject(`Offline logic is not implemented`);
  }

  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id);
    }
    return Promise.reject(`Offline logic is not implemented`);
  }
}
