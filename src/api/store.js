export default class Store {
  constructor(key, storage) {
    this._storageKey = key;
    this._storage = storage;
  }
  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();
    this._storage.setItem(
        this._storageKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        ));
  }

  removeItem(key) {
    const store = this.getItems();
    // Удаляем из объекта свойство с нужным id (key)
    delete store[key];
    // Перезаписываем в хранилище измененный объект
    this._storage.setItem(
        this._storageKey,
        JSON.stringify(store)
    );
  }
}
