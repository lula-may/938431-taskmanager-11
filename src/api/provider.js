import TaskModel from "../models/task.js";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStorageStructure = (items) => {
  return items.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});
};

const getSyncedTasks = (items) => {
  return items.filter((item) => item.success)
  .map((item) => item.payload.task);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncNeeded = false;
  }

  get isSyncNeeded() {
    return this._isSyncNeeded;
  }

  getTasks() {
    if (isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          // Конвертируем массив в объект с ключами - id
          const unitedTasks = createStorageStructure(tasks.map((task) => task.convertToRaw()));
          this._store.setItems(unitedTasks);
          return tasks;
        });
    }
    const storedTasks = Object.values(this._store.getItems());
    return Promise.resolve(TaskModel.parseTasks(storedTasks));
  }

  updateTask(id, task) {
    if (isOnline()) {
      return this._api.updateTask(id, task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.convertToRaw());
          return newTask;
        });
    }
    const localTask = TaskModel.clone(Object.assign(task, {id}));
    this._store.setItem(id, localTask.convertToRaw());
    this._isSyncNeeded = true;
    return Promise.resolve(localTask);
  }

  createTask(task) {
    if (isOnline()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.convertToRaw());
          return newTask;
        });
    }
    const localId = nanoid();
    const localNewTask = TaskModel.clone(Object.assign(task, {id: localId}));
    this._store.setItem(localId, localNewTask.convertToRaw());
    this._isSyncNeeded = true;
    return Promise.resolve(localNewTask);
  }

  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }
    this._store.removeItem(id);
    this._isSyncNeeded = true;
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storedTasks = Object.values(this._store.getItems());

      return this._api.sync(storedTasks)
        .then((response) => {
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);
          const items = createStorageStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }
    return Promise.reject(`Sync data failed`);
  }
}
