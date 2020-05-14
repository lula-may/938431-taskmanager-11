export default class Task {
  constructor(data) {
    this.id = data[`id`];
    this.description = data[`description`] || ``;
    this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    this.repeatingDays = data[`repeating_days`];
    this.color = data[`color`];
    this.isArchive = data[`is_archived`];
    this.isFavorite = data[`is_favorite`];
  }

  static parseTask(data) {
    return new Task(data);
  }

  static parseTasks(tasks) {
    return tasks.map(Task.parseTask);
  }
}
