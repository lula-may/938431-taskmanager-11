import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import flatpickr from "flatpickr";

const ColorToHex = {
  black: `#000000`,
  blue: `#0c5cdd`,
  yellow: `#ffe125`,
  green: `#31b55c`,
  pink: `#ff3cb9`
};

const isUniqItem = (item, index, items) => {
  return items.indexOf(item) === index;
};

const getTasksByDateRange = (tasks, dateFrom, dateTo) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;
    return dueDate <= dateTo && dueDate >= dateFrom;
  });
};

const createPlaceholder = (from, to) => {
  const format = (date) => {
    return moment(date).format(`DD MMM`);
  };

  return `${format(from)} - ${format(to)}`;
};

const getTaksAmountByColor = (tasks, color) => {
  return tasks.filter((task) => task.color === color).length;
};

const generateDatesFromTo = (from, to) => {
  const dates = [];
  let date = new Date(from);
  while (date <= to) {
    dates.push(date);
    date = new Date(date.getDate() + 1);
  }
  return dates;
};

const renderColorsChart = (colorsCtx, tasks) => {
  const colors = tasks
    .map((task) => task.color)
    .filter(isUniqItem);

  const values = colors.map((color) => getTaksAmountByColor(tasks, color));

  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: colors,
      datasets: [{
        data: values,
        backgroundColor: colors.map((color) => ColorToHex[color])
      }],
    },
    options: options,
  });
};

const getStatisticsTemplate = ({tasks, dateFrom, dateTo}) => {
  const placeholder = createPlaceholder(dateFrom, dateTo);
  const tasksAmount = getTasksByDateRange(tasks, dateFrom, dateTo).length;

  return (
    `<section class="statistic container visually-hidden">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="${placeholder}"
            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">${tasksAmount}</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic visually-hidden">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__colors-wrap visually-hidden">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  );

};

export default class Statistics extends AbstractSmartComponent {
  constructor({tasks, dateFrom, dateTo}) {
    super();
    this._tasks = tasks;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    this._colorsChart = null;
    this._daysChart = null;

    this._applyFlatpicker(this.getElement().querySelector(`.statistic__period-input`));
  }

  getTemplate() {
    return getStatisticsTemplate({tasks: this._tasks, dateFrom: this._dateFrom, dateTo: this._dateTo});
  }

  show() {
    super.show();
    this.rerender(this._tasks, this._dateFrom, this._dateTo);
  }

  recoveryListeners() {}

  rerender(tasks, dateFrom, dateTo) {
    this._tasks = tasks;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {}

  _resetCharts() {}

  _applyFlatpicker(element) {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    flatpickr(element, {
      altInput: true,
      allowInput: true,
      defaultDate: [this._dateFrom, this._dateTo],
      mode: `range`,
      onChange: (dates) => {
        if (dates.length === 2) {
          this.rerender(this._tasks, dates[0], dates[1]);
        }
      }
    });
  }
}
