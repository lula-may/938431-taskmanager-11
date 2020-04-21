import TaskComponent from "../components/task.js";
import EditTaskComponent from "../components/edit-task.js";
import {render, replace} from "../utils.render";

export default class TaskController {
  constructor(container) {
    this._container = container;

    this._taskComponent = null;
    this._editTaskComponent = null;
  }

  _replaceTaskToEdit() {
    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener(`keydown`, this._onEscKeydown);
  }

  _replaceEditToTask() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToTask();
    }
  }


  render(task) {

    this._taskComponent = new TaskComponent(task);
    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent = new EditTaskComponent(task);
    this._taskEditComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    render(this._container, this._taskComponent);
  }
}
