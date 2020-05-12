import moment from "moment";

const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const isRepeating = (repeatingDays) => Object.values(repeatingDays).includes(true);

const isOverDue = (dueDate) => {
  return dueDate instanceof Date && dueDate < Date.now();
};

const today = new Date();
const isToday = (dueDate) => {
  return dueDate && dueDate.getDate() === today;
};

const isSameDay = (dateA, dateB) => {
  if (dateA && dateB) {
    const a = dateA.getDate();
    const b = dateB.getDate();
    return a === b;
  }
  return false;
};

export {formatTime, formatDate, isRepeating, isOverDue, isToday, isSameDay};

