import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoTaskComponent from "../components/no-task.js";
import SortComponent from "../components/sort.js";
import TaskController from "../controllers/task.js";
import TasksComponent from "../components/tasks.js";
import {render, remove} from "../utils/render.js";
import {getSortedTasks} from "../utils/data.js";

const SHOWING_TASKS_AMOUNT_ON_START = 8;
const SHOWING_TASKS_AMOUNT_BY_BUTTON = 8;


const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);
    return taskController;
  });

};
export default class BoardController {
  constructor(container, tasksModel) {
    this._tasksModel = tasksModel;
    this._showedTaskControllers = [];
    this._container = container;
    this._showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;

    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    // Обработчики изменения задачи
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    // Обработчик изменения типа сортировки
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTaskComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);
    this._renderTasks(tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    this._showingTasksCount += SHOWING_TASKS_AMOUNT_BY_BUTTON;
    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), this._sortComponent.getSortType())
      .slice(prevTasksCount, this._showingTasksCount);

    this._renderTasks(sortedTasks);
    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasksModel.length) {
      return;
    }
    render(this._container.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onDataChange(oldData, newData) {
    // Проверяем, что изменившаяся задача есть в списке задач
    const index = this._tasks.findIndex((item) => item === oldData);
    if (index === -1) {
      return;
    }
    // Заменяем старый объект задачи на новый в массиве задач
    this._tasks = [].concat(this._tasksModel.slice(0, index), newData, this._tasksModel.slice(index + 1));

    // Оповещаем всех подписчиков, и вызываем метод render у того, у кого есть ссылка на oldData в компоненте
    this._showedTaskControllers.forEach((taskController) => taskController.rerender(oldData, newData));
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((taskController) => {
      taskController.setDefaultView();
    });
  }

  _onSortTypeChange(sortType) {
    debugger;
    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;
    this._showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType);
    // const newTasks = renderTasks(taskListElement, sortedTasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    // this._showedTaskControllers = newTasks;
    this._showedTaskControllers = [];
    this._renderTasks(sortedTasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }
}
