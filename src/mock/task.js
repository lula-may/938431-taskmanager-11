
const WEEK = 7;
const COLORS = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
];

const taskDescriptions = [
  `Изучить теорию`,
  `Выполнить домашку`,
  `Пройти интенсив на соточку`
];
const DefaultRepeatingDays = {
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
const generateRepeatingDays = () => Object.assign({}, DefaultRepeatingDays, {"mo": getRandomBoolean()});

const generateTask = () => {
  const dueDate = Math.random() < 0.5 ? getRandomDate() : null;
  return {
    description: getRandomItem(taskDescriptions),
    dueDate,
    repeatingDays: generateRepeatingDays(),
    color: getRandomItem(COLORS),
    isArchive: getRandomBoolean(),
    isFavourite: getRandomBoolean(),
  };
};

const generateTasks = (amount) => {
  return new Array(amount).fill(``).map(generateTask);
};

export {generateTask, generateTasks};
