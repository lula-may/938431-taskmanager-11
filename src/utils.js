const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforend`,
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};

const getElement = (template) => {
  const divElement = document.createElement(`div`);
  divElement.innerHTML = template;
  return divElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {RenderPosition, formatTime, getElement, render};
