import TaskComponent from "../components/task.js";
import EditTaskComponent from "../components/edit-task.js";
import {render, replace} from "../utils/render";

export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._taskComponent = null;
    this._editTaskComponent = null;

    this._onEscKeydown = this._onEscKeydown.bind(this);
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
    const oldTaskComponent = this._taskComponent;
    const oldEditTaskComponent = this._editTaskComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });
    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {isArchive: !task.isArchive}));
    });
    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {isFavorite: !task.isFavorite}));
    });

    this._taskEditComponent = new EditTaskComponent(task);
    this._taskEditComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    if (oldTaskComponent || oldEditTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldEditTaskComponent);
    } else {
      render(this._container, this._taskComponent);
    }
  }
}
