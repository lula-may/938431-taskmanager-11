import {getMainMenuTemplate} from "./components/main-menu.js";
import {getFilterTemplate} from "./components/filter.js";
import {getSortingBoardTemplate} from "./components/sorting.js";
import {getEditTaskTemplate} from "./components/edit-task.js";
import {getTaskTemplate} from "./components/task.js";
import {getLoadMoreButtonTemplate} from "./components/more-button.js";
import {generateTasks} from "./mock/task.js";
const TASK_AMOUNT = 20;
const tasks = generateTasks(TASK_AMOUNT);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteMenuElement = siteMainElement.querySelector(`.main__control`);

render(siteMenuElement, getMainMenuTemplate());
render(siteMainElement, getFilterTemplate());
render(siteMainElement, getSortingBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(taskListElement, getEditTaskTemplate(tasks[0]));
for (let i = 1; i < TASK_AMOUNT; i++) {
  render(taskListElement, getTaskTemplate(tasks[i]));
}

render(boardElement, getLoadMoreButtonTemplate());
