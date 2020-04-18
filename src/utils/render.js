
const createElement = (template) => {
  const divElement = document.createElement(`div`);
  divElement.innerHTML = template;
  return divElement.firstChild;
};

const render = (container, element, place = `beforeend`) => {
  if (place === `afterbegin`) {
    container.prepend(element);
    return;
  }
  if (place === `beforeend`) {
    container.append(element);
    return;
  }
};

export {createElement, render};
