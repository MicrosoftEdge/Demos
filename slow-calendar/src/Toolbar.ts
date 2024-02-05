import { EventTarget, Event } from "event-target-shim";
import { formatMonthYear } from "./utils";

export class Toolbar extends EventTarget {
  private rootEl: HTMLElement;
  private _date: Date;
  private selectedMode: string = "month";

  constructor(private el: HTMLElement, date: Date, mode: string) {
    super();

    this.rootEl = el;
    this._date = date;
    this.selectedMode = mode;

    this.render();
  }

  render() {
    this.rootEl.innerHTML = `
      <button id="prev-month">Prev</button>
      <button id="today" class="primary">Today</button>
      <button id="next-month">Next</button>
      <span id="month-year">${formatMonthYear(this._date)}</span>
      <input type="radio" name="view" id="month-view" ${this.selectedMode === "month" ? "checked" : ""}>
      <label for="month-view">Month</label>
      <input type="radio" name="view" id="week-view" ${this.selectedMode === "week" ? "checked" : ""}>
      <label for="week-view">Week</label>      
      <input type="radio" name="view" id="day-view" ${this.selectedMode === "day" ? "checked" : ""}>
      <label for="day-view">Day</label>      
    `;

    this.rootEl.querySelector('#prev-month').addEventListener('click', () => {
      console.log(`Prev ${this.selectedMode} clicked`);
      this.dispatchEvent(new Event('prev'));
    });

    this.rootEl.querySelector('#next-month').addEventListener('click', () => {
      console.log(`Next ${this.selectedMode} clicked`);
      this.dispatchEvent(new Event('next'));
    });

    this.rootEl.querySelector('#today').addEventListener('click', () => {
      console.log("Today clicked");
      this.dispatchEvent(new Event('today'));
    });

    this.rootEl.querySelector('#month-view').addEventListener('click', () => {
      console.log("Month view clicked");
      this.dispatchEvent(new Event('month-view'));
      this.selectedMode = "month";
    });

    this.rootEl.querySelector('#week-view').addEventListener('click', () => {
      console.log("Week view clicked");
      this.dispatchEvent(new Event('week-view'));
      this.selectedMode = "week";
    });

    this.rootEl.querySelector('#day-view').addEventListener('click', () => {
      console.log("Day view clicked");
      this.dispatchEvent(new Event('day-view'));
      this.selectedMode = "day";
    });
  }

  set date(date: Date) {
    this._date = date;
    this.render();
  }
}
