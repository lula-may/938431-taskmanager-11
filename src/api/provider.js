import TaskModel from "../models/task.js";
import {nanoid} from "nanoid";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          // Конвертируем массив в объект с ключами - id
          const unitedTasks = tasks.reduce((acc, task) => {
            acc[task.id] = task;
            return acc;
          }, {});
          this._store.setItems(unitedTasks);
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

  createTask(task) {
    if (this._isOnline()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.convertToRaw());
          return newTask;
        });
    }
    const localId = nanoid();
    const localNewTask = TaskModel.clone(Object.assign(task, {id: localId}));
    this._store.setItem(localId, localNewTask.convertToRaw());
    return Promise.resolve(localNewTask);
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
