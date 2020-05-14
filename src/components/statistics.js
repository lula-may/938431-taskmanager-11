import AbstractSmartComponent from "./abstract-smart-component.js";
import {isSameDay} from "../utils/common.js";
import {FilterType} from "../const.js";
import {getTasksByFilter} from "../controllers/filter.js";
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

const isUniqueItem = (item, index, items) => {
  return items.indexOf(item) === index;
};

const getTasksByDateRange = (tasks, dateFrom, dateTo) => {
  return tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }
    const dueDate = task.dueDate.getDate();
    return dueDate <= dateTo.getDate() && dueDate >= dateFrom.getDate();
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
    date = new Date(date);
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const renderColorsChart = (colorsCtx, tasks) => {
  const colors = tasks
    .map((task) => task.color)
    .filter(isUniqueItem);

  const values = colors.map((color) => getTaksAmountByColor(tasks, color));

  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      // Данные для расчета и построения диаграммы
      // Подписи для элементов легенды
      labels: colors,
      // Набор числовых значений и соответствующих им цветов на диаграмме
      datasets: [{
        data: values,
        backgroundColor: colors.map((color) => ColorToHex[color])
      }],
    },
    options: {
      // Дополнительные настройки
      plugins: {
        // Значения элементов не отображаются на соответствующих секторах диаграммы
        datalabels: {
          display: false,
        }
      },
      tooltips: {
        // Настройки для всплывающих подсказок
        callbacks: {
          // Формирование текста подсказки
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS - ${tooltipPercentage}%`;
          }
        },
        // Стили для подсказки
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15,
      },
      // Стили для заголовка диаграммы
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`,
      },
      // Настройки для легенды диаграммы
      legend: {
        position: `left`,
        // Стили для подписей
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderDaysChart = (daysCtx, tasks, dateFrom, dateTo) => {
  const days = generateDatesFromTo(dateFrom, dateTo);

  const tasksAmountOnDay = days.map((date) => {
    return tasks.filter((task) => {
      return isSameDay(task.dueDate, date);
    }).length;
  });

  const formattedDates = days.map((day) => moment(day).format(`DD MMM`));

  return new Chart(daysCtx, {
    plugins: [ChartDataLabels],
    type: `line`,
    data: {
      labels: formattedDates,
      datasets: [{
        data: tasksAmountOnDay,
        backgroundColor: `transparent`,
        borderColor: `#000000`,
        borderWidth: 1,
        lineTension: 0,
        pointRadius: 8,
        pointHoverRadius: 8,
        pointBackgroundColor: `#000000`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 8
          },
          color: `#ffffff`
        }
      },
      scales: {
        // Настройки для оси Y
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          // Отображение сетки и границы: скрыто
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        // Настройки оси Х
        xAxes: [{
          ticks: {
            fontStyle: `bold`,
            fontColor: `#000000`
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        // Легенда скрыта
        display: false
      },
      layout: {
        // Расположение графика
        padding: {
          top: 10,
        }
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const getStatisticsTemplate = ({tasks, dateFrom, dateTo}) => {
  const placeholder = createPlaceholder(dateFrom, dateTo);
  let tasksAmount = getTasksByDateRange(tasks, dateFrom, dateTo).length;

  return (
    `<section class="statistic container">
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
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__colors-wrap">
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
    this._defaultDateFrom = dateFrom;
    this._defaultDateTo = dateTo;
    this._archiveTasks = getTasksByFilter(tasks.getTasksAll(), FilterType.ARCHIVE);

    this._colorsChart = null;
    this._daysChart = null;

    this._applyFlatpicker(this.getElement().querySelector(`.statistic__period-input`));
    this._renderCharts();
  }

  getTemplate() {
    return getStatisticsTemplate({tasks: this._archiveTasks, dateFrom: this._dateFrom, dateTo: this._dateTo});
  }

  show() {
    this.rerender(this._dateFrom, this._dateTo);
    super.show();
  }

  recoveryListeners() {}

  rerender(dateFrom, dateTo) {
    this._archiveTasks = getTasksByFilter(this._tasks.getTasksAll(), FilterType.ARCHIVE);
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    super.rerender();
    this._renderCharts();
  }

  reset() {
    this._dateFrom = this._defaultDateFrom;
    this._dateTo = this._defaultDateTo;
  }

  _renderCharts() {
    const element = this.getElement();

    this._applyFlatpicker(element.querySelector(`.statistic__period-input`));

    const colorCtx = element.querySelector(`.statistic__colors`);
    const daysCtx = element.querySelector(`.statistic__days`);

    this._resetCharts();

    this._daysChart = renderDaysChart(daysCtx, this._archiveTasks, this._dateFrom, this._dateTo);
    const tasksByPeriod = getTasksByDateRange(this._archiveTasks, this._dateFrom, this._dateTo);
    this._colorsChart = renderColorsChart(colorCtx, tasksByPeriod);
  }

  _resetCharts() {
    if (this._daysChart) {
      this._daysChart.destroy();
      this._daysChart = null;
    }

    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }
  }

  _applyFlatpicker(element) {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    flatpickr(element, {
      altInput: true,
      allowInput: true,
      defaultDate: [this._dateFrom, this._dateTo],
      dateFormat: `d M`,
      altFormat: `d M`,
      mode: `range`,
      locale: {
        rangeSeparator: ` - `
      },
      onChange: (dates) => {
        if (dates.length === 2) {
          this.rerender(dates[0], dates[1]);
        }
      }
    });
  }
}
