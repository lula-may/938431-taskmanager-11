import EditTaskComponent from "../components/edit-task.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoTaskComponent from "../components/no-task.js";
import SortComponent from "../components/sort.js";
import TaskComponent from "../components/task.js";
import TasksComponent from "../components/tasks.js";
import {render, replace, remove} from "../utils/render.js";

const SHOWING_TASKS_AMOUNT_ON_START = 8;
const SHOWING_TASKS_AMOUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeydown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeydown);
    }
  };

  const onEditButtonClick = () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeydown);
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeydown);
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(onEditButtonClick);

  const taskEditComponent = new EditTaskComponent(task);
  taskEditComponent.setEditFormSubmitHandler(onEditFormSubmit);

  render(taskListElement, taskComponent);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      render(container, this._noTaskComponent);
      return;
    }
    // Отрисовываю блок сортировки и контейнер для карточек задач
    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = container.querySelector(`.board__tasks`);
    // Отрисовываю первую порцию карточек
    let showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
    tasks.slice(0, showingTasksCount)
      .forEach((task) => {
        renderTask(taskListElement, task);
      });

    // Кнопка Load More c обработчиком
    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount += SHOWING_TASKS_AMOUNT_BY_BUTTON;
      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => renderTask(taskListElement, task));
      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }
}
