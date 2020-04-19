import {SortType} from "../components/sort.js";

export const getSortedTasks = (tasks, sortType) => {
  let sortedTasks = [];
  let noDueDateTasks = [];
  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = tasks.slice().filter((task) => !!(task.dueDate)).sort((left, right) => left.dueDate - right.dueDate);
      noDueDateTasks = tasks.slice().filter((task) => !(task.dueDate));
      sortedTasks = [...sortedTasks, ...noDueDateTasks];
      break;
    case SortType.DATE_DOWN:
      sortedTasks = tasks.slice().filter((task) => !!(task.dueDate)).sort((left, right) => right.dueDate - left.dueDate);
      noDueDateTasks = tasks.slice().filter((task) => !(task.dueDate));
      sortedTasks = [...noDueDateTasks, ...sortedTasks];
      break;
    case SortType.DEFAULT:
      sortedTasks = tasks.slice();
      break;
  }
  return sortedTasks;
};
