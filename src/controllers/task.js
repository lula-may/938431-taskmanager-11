import TaskComponent from "../components/task.js";
import EditTaskComponent from "../components/edit-task.js";
import {render, replace, remove, RenderPosition} from "../utils/render";
import {COLORS, TaskMode as Mode} from "../const.js";


const DEFAULT_COLOR = COLORS[0];

const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: DEFAULT_COLOR,
  isArchive: false,
  isFavorite: false,
};

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
    if (document.contains(this._editTaskComponent.getElement())) {
      replace(this._taskComponent, this._editTaskComponent);
    }
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this.removeCreatingTask();
      this._replaceEditToTask();
    }
  }


  render(task, mode = Mode.DEFAULT) {
    if (!task) {
      task = Object.assign({}, EmptyTask);
    }

    const oldTaskComponent = this._taskComponent;
    const oldEditTaskComponent = this._editTaskComponent;

    this._mode = mode;
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
      const newData = this._editTaskComponent.getData();
      this._onDataChange(task, newData);
    });

    this._editTaskComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(task, null);
    });


    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldEditTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._editTaskComponent, oldEditTaskComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent);
        }
        break;
      case Mode.ADDING:
        // Если уже есть компоненты - удаляем их
        // Вешаем обработчик Esc для закрытия
        // Отрисовываем форму редактирования в начало списка
        if (oldTaskComponent && oldEditTaskComponent) {
          remove(oldTaskComponent);
          remove(oldEditTaskComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeydown);
        render(this._container, this._editTaskComponent, RenderPosition.AFTERBEGIN);
        break;
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

  removeCreatingTask() {
    if (this._mode !== Mode.ADDING) {
      return;
    }
    this._onDataChange(EmptyTask, null);
  }
}
