const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `archive`
];
const getOverdueTasksAmount = (tasks) => {
  return tasks.reduce((acc, task) => {
    if (task.dueDate && task.dueDate < Date.now()) {
      acc++;
    }
    return acc;
  }, 0);
};
const today = new Date().getDate();

const getTodayTasksAmount = (tasks) => {
  return tasks.reduce((acc, task) => {
    if (task.dueDate && task.dueDate.getDate() === today) {
      acc++;
    }
    return acc;
  }, 0);
};

const getFavoriteTasksAmount = (tasks) => {
  return tasks.reduce((acc, task) => {
    if (task.isFavorite) {
      acc++;
    }
    return acc;
  }, 0);
};

const getArchiveTasksAmount = (tasks) => {
  return tasks.reduce((acc, task) => {
    if (task.isArchive) {
      acc++;
    }
    return acc;
  }, 0);

};

const getRepeatingTasksAmount = (tasks) => {
  return tasks.reduce((acc, task) => {
    const isRepeating = Object.values(task.repeatingDays).some(Boolean);
    if (isRepeating) {
      acc++;
    }
    return acc;
  }, 0);
};

const FilterCount = {
  [`all`]: (task) => task.length,
  [`overdue`]: getOverdueTasksAmount,
  [`today`]: getTodayTasksAmount,
  [`favorites`]: getFavoriteTasksAmount,
  [`repeating`]: getRepeatingTasksAmount,
  [`archive`]: getArchiveTasksAmount
};

export const generateFilters = (tasks) => {
  return filterNames.map((title) => {
    return {
      title,
      count: FilterCount[title](tasks)
    };
  });
};
