import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterController from "./controllers/filter.js";
import MainMenuComponent, {MenuItem} from "./components/main-menu.js";
import StatisticsComponent from "./components/statistics.js";
import TasksModel from "./models/tasks.js";
import {generateTasks} from "./mock/task.js";
import {render} from "./utils/render.js";
import {FilterType} from "./const.js";

const TASK_AMOUNT = 20;
const tasks = generateTasks(TASK_AMOUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const mainMenuComponent = new MainMenuComponent();
render(siteHeaderElement, mainMenuComponent);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render(tasks);

const statisticsComponent = new StatisticsComponent();
render(siteMainElement, statisticsComponent);

mainMenuComponent.setOnChangeHandler((menuItem) => {
  mainMenuComponent.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      tasksModel.setFilter(FilterType.ALL);
      filterController.setActiveFilter(FilterType.ALL);
      boardController.createTask();
      break;
    case MenuItem.TASKS:
      boardController.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      boardController.resetSort();
  }
  return;
});
