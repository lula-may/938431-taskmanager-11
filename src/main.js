import {getMainMenuTemplate} from "./components/main-menu.js";
import {getFilterTemplate} from "./components/filter.js";
import {getSortingBoardTemplate} from "./components/sorting.js";
import {getTaskCreateTemplate} from "./components/new-task.js";
import {getTaskTemplate} from "./components/task.js";
import {getLoadMoreButtonTemplate} from "./components/more-button.js";
const TASK_AMOUNT = 3;

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

render(taskListElement, getTaskCreateTemplate());
for (let i = 0; i < TASK_AMOUNT; i++) {
  render(taskListElement, getTaskTemplate());
}

render(boardElement, getLoadMoreButtonTemplate());
