import BoardComponent from "./components/board.js";
import FilterComponent from "./components/filter.js";
import MainMenuComponent from "./components/main-menu.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils/render.js";
import BoardController from "./controllers/board-controller.js";

const TASK_AMOUNT = 0;
const tasks = generateTasks(TASK_AMOUNT);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteMenuElement = siteMainElement.querySelector(`.main__control`);
const boardComponent = new BoardComponent();

render(siteMenuElement, new MainMenuComponent());
render(siteMainElement, new FilterComponent(filters));
render(siteMainElement, boardComponent);
const boardController = new BoardController(boardComponent);
boardController.render(tasks);
