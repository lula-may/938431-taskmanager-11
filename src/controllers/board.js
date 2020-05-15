import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoTaskComponent from "../components/no-task.js";
import SortComponent from "../components/sort.js";
import TaskController, {} from "../controllers/task.js";
import TasksComponent from "../components/tasks.js";
import {render, remove} from "../utils/render.js";
import {getSortedTasks} from "../utils/sort.js";
import {SortType} from "../const.js";

const SHOWING_TASKS_AMOUNT_ON_START = 8;
const SHOWING_TASKS_AMOUNT_BY_BUTTON = 8;

const Mode = {
  ADDING: `adding`,
  TASKS: `tasks`,
};


const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);
    return taskController;
  });

};
export default class BoardController {
  constructor(container, tasksModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._api = api;
    this._showedTaskControllers = [];
    this._creatingTask = null;
    this._activeMode = Mode.TASKS;
    this._newTaskController = null;
    this._showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
    this._currentFilteredTasks = [];

    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    // Обработчики изменения задачи
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    // Обработчики изменения типа сортировки и фильтра
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandlers(this._onFilterTypeChange);
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    this._currentFilteredTasks = tasks;
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

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }
    this._activeMode = Mode.ADDING;
    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(null);
    this._newTaskController = this._creatingTask;
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
    remove(this._loadMoreButtonComponent);
  }

  _updateTasks(count) {
    this._removeTasks();
    this._currentFilteredTasks = this._tasksModel.getTasks();
    this._renderTasks(this._currentFilteredTasks.slice(0, count));
    this._renderLoadMoreButton();
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    this._showingTasksCount += SHOWING_TASKS_AMOUNT_BY_BUTTON;
    const nextTasks = this._currentFilteredTasks.slice(prevTasksCount, this._showingTasksCount);

    this._renderTasks(nextTasks);
    if (this._showingTasksCount >= this._currentFilteredTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._currentFilteredTasks.length || !this._loadMoreButtonComponent.getElement()) {
      return;
    }
    render(this._container.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onDataChange(oldData, newData) {
    // Создание новой задачи
    if (this._activeMode === Mode.ADDING && !oldData.id) {
      this._creatingTask = null;
      // Если новая задача не сохранена, удаляем контроллер новой задачи
      if (newData === null) {
        this._newTaskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        // Отправляем новую задачу на сервер
        // Добавляем новую задачу в модель, заменяем форму редактирования на обычную карточку
        this._api.createTask(newData)
          .then((taskModel) => {
            this._tasksModel.addTask(taskModel);
            this._newTaskController.render(taskModel);
            this._showedTaskControllers.unshift(this._newTaskController);
            this._showingTasksCount = this._showedTaskControllers.length;

            // Если теперь карточек отображается больше, чем нужно - удаляем лишнюю
            if (this._showingTasksCount % SHOWING_TASKS_AMOUNT_BY_BUTTON !== 0) {
              const destroyedController = this._showedTaskControllers.pop();
              destroyedController.destroy();
            }
            this._showingTasksCount = this._showedTaskControllers.length;
            this._renderLoadMoreButton();
          });
      }
      this._activeMode = Mode.TASKS;
      return;
    }
    // Удаление задачи
    if (newData === null) {
      this._api.deleteTask(oldData.id)
        .then(() => {
          this._tasksModel.removeTask(oldData.id);
          this._updateTasks(this._showingTasksCount);
          return;
        });
    }

    // Изменение задачи
    this._api.updateTask(oldData.id, newData)
      .then((taskModel) => {
        const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel);
        if (isSuccess) {
          // Оповещаем всех подписчиков, и вызываем метод render у того, у кого есть ссылка на oldData в компоненте
          this._showedTaskControllers.forEach((taskController) => taskController.rerender(oldData, taskModel));
        }
      });
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((taskController) => {
      taskController.setDefaultView();
    });
  }

  _onSortTypeChange(type) {
    this._removeTasks();
    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
    this._currentFilteredTasks = getSortedTasks(this._tasksModel.getTasks(), type);
    this._renderTasks(this._currentFilteredTasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }

  _onFilterTypeChange() {
    this.resetSort();
  }

  resetSort() {
    this._showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
    this._sortComponent.setSortType(SortType.DEFAULT);
    this._updateTasks(this._showingTasksCount);
  }
}
