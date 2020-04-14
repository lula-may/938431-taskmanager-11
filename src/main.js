import BoardComponent from "./components/board.js";
import EditTaskComponent from "./components/edit-task.js";
import FilterComponent from "./components/filter.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import MainMenuComponent from "./components/main-menu.js";
import SortComponent from "./components/sort.js";
import TaskComponent from "./components/task.js";
import TasksComponent from "./components/tasks.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils.js";

const TASK_AMOUNT = 20;
const SHOWING_TASKS_AMOUNT_ON_START = 8;
const SHOWING_TASKS_AMOUNT_BY_BUTTON = 8;

const tasks = generateTasks(TASK_AMOUNT);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteMenuElement = siteMainElement.querySelector(`.main__control`);

render(siteMenuElement, getMainMenuTemplate());
render(siteMainElement, getFilterTemplate(filters));
render(siteMainElement, getSortingBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(taskListElement, getEditTaskTemplate(tasks[0]));

let showingTasksCount = SHOWING_TASKS_AMOUNT_ON_START;
tasks.slice(1, showingTasksCount)
  .forEach((task) => render(taskListElement, getTaskTemplate(task)));

render(boardElement, getLoadMoreButtonTemplate());

const loadMoreButtonElement = document.querySelector(`.load-more`);
loadMoreButtonElement.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_AMOUNT_BY_BUTTON;
  tasks.slice(prevTasksCount, showingTasksCount)
  .forEach((task) => render(taskListElement, getTaskTemplate(task)));
  if (showingTasksCount >= TASK_AMOUNT) {
    loadMoreButtonElement.remove();
  }
});

