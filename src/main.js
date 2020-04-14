import {getMainMenuTemplate} from "./components/main-menu.js";
import {getFilterTemplate} from "./components/filter.js";
import {getSortingBoardTemplate} from "./components/sorting.js";
import {getEditTaskTemplate} from "./components/edit-task.js";
import {getTaskTemplate} from "./components/task.js";
import {getLoadMoreButtonTemplate} from "./components/more-button.js";
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

