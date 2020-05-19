export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    return this._api.getTasks();
  }

  updateTasks(id, data) {
    return this._api.updateTasks(id, data);
  }

  createTask(data) {
    return this._api.createTask(data);
  }

  deleteTask(id) {
    return this._api.deleteTask(id);
  }
}
