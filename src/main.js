import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterController from "./controllers/filter.js";
// import FilterComponent from "./components/filter.js";
import MainMenuComponent from "./components/main-menu.js";
import TasksModel from "./models/tasks.js";
import {generateTasks} from "./mock/task.js";
// import {generateFilters} from "./utils/filter.js";
import {render} from "./utils/render.js";

const TASK_AMOUNT = 20;
const tasks = generateTasks(TASK_AMOUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);
// const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteMenuElement = siteMainElement.querySelector(`.main__control`);
const boardComponent = new BoardComponent();

render(siteMenuElement, new MainMenuComponent());
const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();
// render(siteMainElement, new FilterComponent(filters));
render(siteMainElement, boardComponent);
const boardController = new BoardController(boardComponent, tasksModel);
boardController.render(tasks);
