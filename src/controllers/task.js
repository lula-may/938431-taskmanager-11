import TaskComponent from "../components/task.js";
import EditTaskComponent from "../components/edit-task.js";
import {render, replace, remove} from "../utils/render";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._taskComponent = null;
    this._editTaskComponent = null;

    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._editTaskComponent, this._taskComponent);
    this._mode = Mode.EDIT;
    document.addEventListener(`keydown`, this._onEscKeydown);
  }

  _replaceEditToTask() {
    this._editTaskComponent.reset();
    replace(this._taskComponent, this._editTaskComponent);
    this._mode = Mode.DEFAULT;
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
    this._editTaskComponent = new EditTaskComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });
    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {isArchive: !task.isArchive}));
    });
    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(task, Object.assign({}, task, {isFavorite: !task.isFavorite}));
    });

    this._editTaskComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    if (oldTaskComponent && oldEditTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._editTaskComponent, oldEditTaskComponent);
    } else {
      render(this._container, this._taskComponent);
    }
  }

  rerender(oldTask, newTask) {
    if (this._taskComponent.task === oldTask) {
      this.render(newTask);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._editTaskComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }
}
