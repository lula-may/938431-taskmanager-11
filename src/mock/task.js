import {COLORS} from "../const.js";

const WEEK = 7;
const taskDescriptions = [
  `Изучить теорию`,
  `Выполнить домашку`,
  `Пройти интенсив на соточку`
];
const defaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};
const getRandomItem = (elements) => elements[Math.floor(Math.random() * elements.length)];
const getRandomBoolean = () => Math.random() > 0.5;
const getRandomIntegerFrom = (min, max) => Math.round(Math.random() * (max - min) + min);
const getRandomDate = () => {
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() + getRandomIntegerFrom(-WEEK, WEEK));
  return randomDate;
};
const generateRepeatingDays = () => Object.assign({}, defaultRepeatingDays, {"mo": getRandomBoolean()});

const generateTask = () => {
  const dueDate = Math.random() < 0.5 ? getRandomDate() : null;
  return {
    description: getRandomItem(taskDescriptions),
    dueDate,
    repeatingDays: generateRepeatingDays(),
    color: getRandomItem(COLORS),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
  };
};

const generateTasks = (amount) => {
  return new Array(amount).fill(``).map(generateTask);
};

export {generateTask, generateTasks};
