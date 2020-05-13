export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }
  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/taskmanager/tasks`)
      .then((response) => response.json());
  }
}
