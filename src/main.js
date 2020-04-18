import BoardComponent from "./components/board.js";
import EditTaskComponent from "./components/edit-task.js";
import FilterComponent from "./components/filter.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import MainMenuComponent from "./components/main-menu.js";
import NoTaskComponent from "./components/no-task.js";
import SortComponent from "./components/sort.js";
import TaskComponent from "./components/task.js";
import TasksComponent from "./components/tasks.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render, replace, remove} from "./utils/render.js";

const TASK_AMOUNT = 20;
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
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const taskEditComponent = new EditTaskComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`.card__form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(taskListElement, taskComponent);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTaskComponent());
    return;
  }
  // Отрисовываю блок сортировки и контейнер для карточек задач
  render(boardComponent.getElement(), new SortComponent());
  render(boardComponent.getElement(), new TasksComponent());

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  // Отрисовываю первую порцию карточек
  let showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  // Кнопка Load More c обработчиком
  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount += SHOWING_TASKS_AMOUNT_BY_BUTTON;
    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));
    if (showingTasksCount >= TASK_AMOUNT) {
      remove(loadMoreButtonComponent);
    }
  });
};

const tasks = generateTasks(TASK_AMOUNT);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteMenuElement = siteMainElement.querySelector(`.main__control`);
const boardComponent = new BoardComponent();

render(siteMenuElement, new MainMenuComponent());
render(siteMainElement, new FilterComponent(filters));
render(siteMainElement, boardComponent);

renderBoard(boardComponent, tasks);


