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

export const generateFilters = (tasks) => {
  return [
    {
      title: `all`,
      count: tasks.length
    },
    {
      title: `overdue`,
      count: getOverdueTasksAmount(tasks)
    },
    {
      title: `today`,
      count: getTodayTasksAmount(tasks)
    },
    {
      title: `favorites`,
      count: getFavoriteTasksAmount(tasks)
    },
    {
      title: `repeating`,
      count: getRepeatingTasksAmount(tasks)
    },
    {
      title: `isArchive`,
      count: getArchiveTasksAmount(tasks)
    }
  ];
};

