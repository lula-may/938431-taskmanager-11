import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoTaskComponent from "../components/no-task.js";
import SortComponent from "../components/sort.js";
import TaskController from "../controllers/task.js";
import TasksComponent from "../components/tasks.js";
import {render, remove} from "../utils/render.js";
import {getSortedTasks} from "../utils/data.js";

const SHOWING_TASKS_AMOUNT_ON_START = 8;
const SHOWING_TASKS_AMOUNT_BY_BUTTON = 8;


const renderTasks = (taskListElement, tasks) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement);
    taskController.render(task);
    return taskController;
  });

};
export default class Board {
  constructor(container) {
    this._tasks = [];
    this._showedTaskControllers = [];
    this._container = container;
    this._showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;

    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    // Обработчик изменения типа сортировки
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }
    render(this._container.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount += SHOWING_TASKS_AMOUNT_BY_BUTTON;
      const taskListElement = this._tasksComponent.getElement();
      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType())
        .slice(prevTasksCount, this._showingTasksCount);

      const newTasks = renderTasks(taskListElement, sortedTasks);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;
    this._showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
    const sortedTasks = getSortedTasks(this._tasks, sortType);
    const newTasks = renderTasks(taskListElement, sortedTasks.slice(0, this._showingTasksCount));

    this._showedTaskControllers = newTasks;
    this._renderLoadMoreButton();
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTaskComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount));

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._renderLoadMoreButton();
  }
}
