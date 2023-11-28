import { EventTarget, Event } from "event-target-shim";
import { CalendarEvent } from "./CalendarEvent";
import { getEventsForDay } from "./utils";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class MonthGrid extends EventTarget {
  private rootEl: HTMLElement;
  private _date: Date = new Date();
  private _events: CalendarEvent[];

  constructor(private el: HTMLElement, date: Date, events: CalendarEvent[]) {
    super();

    this.rootEl = el;
    this._date = date;
    this._events = events;

    this.render();
  }
  
  render() {
    this.rootEl.innerHTML = '';

    const month = this._date.getMonth();
    const year = this._date.getFullYear();
  
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    const firstWeekday = firstDay.getDay();
    const lastWeekday = lastDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInLastMonth = new Date(year, month, 0).getDate();
    const days: {date: Date, html: string}[] = [];
  
    let indexInGrid = 0;

    // Days from last month
    for (let i = daysInLastMonth - firstWeekday + 1; i <= daysInLastMonth; i++) {
      const date = new Date(year, month - 1, i);
      days.push({date, html: this.renderDay(date, i, indexInGrid, 'prev-month')});
      indexInGrid++;
    }
  
    // Days from this month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({date, html: this.renderDay(date, i, indexInGrid)});
      indexInGrid++;
    }
  
    // Days from next month
    for (let i = 1; i <= 7 - lastWeekday - 1; i++) {
      const date = new Date(year, month + 1, i);
      days.push({date, html: this.renderDay(date, i, indexInGrid, 'next-month')});
      indexInGrid++;
    }

    for (const {date, html} of days) {
      this.rootEl.insertAdjacentHTML('beforeend', html);
      const dayEl = this.rootEl.lastElementChild as HTMLElement;

      dayEl.addEventListener('click', (e: MouseEvent) => {
        // @ts-ignore
        this.dispatchEvent(new CustomEvent('day-clicked', {detail: date}));
      });
    }

    this.updateNowMarker();
  }

  renderDay(date: Date, dayNumber: number, indexInGrid: number, className: string = ''): string {
    const events = getEventsForDay(this._events, date);
    const isToday = date.toDateString() === new Date().toDateString();

    return `
      <div class="day ${isToday ? 'today' : ''} ${className}">
        <div class="header">
          <span class="day-name">${DAYS[date.getDay()]}</span>
          <span class="day-number">${dayNumber}</span>
        </div>
        <ul class="events">
          ${events.map(event => event.asOneLineHTML(indexInGrid)).join('')}
        </ul>
      </div>
    `;
  }

  updateNowMarker() {
    const now = new Date();
    const time = now.getHours() * 100 + now.getMinutes();
    const ratio = time * 100 / 2400;

    // Forcing a sync reflow here by querying the offsetHeight of the day cell.
    // Could just set the % value directly instead.
    const dayEl = this.rootEl.querySelector('.day.today') as HTMLElement;
    if (dayEl) {
      const pxHeight = dayEl.offsetHeight;
      const markerHeight = pxHeight * ratio / 100;

      this.rootEl.style.setProperty('--now-marker', `${markerHeight}px`);
    }

    setTimeout(() => this.updateNowMarker(), 1000);
  }

  set date(date: Date) {
    this._date = date;
    this.render();
  }

  set events(events: CalendarEvent[]) {
    this._events = events;
    this.render();
  }
}
