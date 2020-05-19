import API from "./api/api.js";
import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterController from "./controllers/filter.js";
import MainMenuComponent, {MenuItem} from "./components/main-menu.js";
import StatisticsComponent from "./components/statistics.js";
import TasksModel from "./models/tasks.js";
import {render} from "./utils/render.js";
import {FilterType} from "./const.js";

const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;
const AUTHORIZATION = `Basic dk8Sdapo84Ed6bL`;

const dateTo = new Date();
const dateFrom = (() => {
  const date = new Date(dateTo);
  date.setDate(dateTo.getDate() - 7);
  return date;
})();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const api = new API(AUTHORIZATION, END_POINT);
const tasksModel = new TasksModel();

const mainMenuComponent = new MainMenuComponent();
const filterController = new FilterController(siteMainElement, tasksModel);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, api);
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

render(siteHeaderElement, mainMenuComponent);
filterController.render();
render(siteMainElement, boardComponent);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

mainMenuComponent.setOnChangeHandler((menuItem) => {
  mainMenuComponent.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      boardController.show();
      statisticsComponent.hide();
      statisticsComponent.reset();
      tasksModel.setFilter(FilterType.ALL);
      filterController.setActiveFilter(FilterType.ALL);
      boardController.createTask();
      break;
    case MenuItem.TASKS:
      boardController.show();
      statisticsComponent.hide();
      statisticsComponent.reset();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      boardController.resetSort();
  }
  return;
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
  .then(() => {})
  .catch((err) => {
    throw err;
  });
});
