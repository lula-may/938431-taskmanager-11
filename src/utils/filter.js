import {FilterType} from "../const.js";
import {isRepeating, isToday} from "./common.js";

const getOverdueTasks = (tasks) => {
  return tasks.filter((task) => {
    return task.dueDate && task.dueDate < Date.now();
  });
};

const getTodayTasks = (tasks) => {
  return tasks.filter((task) => isToday(task.dueDate));
};

const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksByFilter = (tasks, filterName) => {
  switch (filterName) {
    case FilterType.ALL: return getNotArchiveTasks(tasks);
    case FilterType.OVERDUE: return getOverdueTasks(tasks);
    case FilterType.TODAY: return getTodayTasks(tasks);
    case FilterType.FAVORITES: return getFavoriteTasks(tasks);
    case FilterType.REPEATING: return getRepeatingTasks(tasks);
    case FilterType.ARCHIVE: return getArchiveTasks(tasks);
    default: return tasks;
  }
};
