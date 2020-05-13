export default class API {
  getTasks() {
    return fetch(`https://11.ecmascript.pages.academy/taskmanager/tasks`);
  }
}
