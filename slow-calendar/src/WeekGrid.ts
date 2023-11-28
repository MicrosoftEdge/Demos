import { EventTarget, Event } from "event-target-shim";
import { CalendarEvent } from "./CalendarEvent";
import { getEventsForDay } from "./utils";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class WeekGrid extends EventTarget {
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

    // Find the dates that make the week around this._date.
    const month = this._date.getMonth();
    const year = this._date.getFullYear();
    const date = this._date.getDate();
    const day = this._date.getDay();

    const firstDay = new Date(year, month, date - day);

    // Iterate over the dates and render the days.
    const days: {date: Date, html: string}[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, firstDay.getDate() + i);
      this.rootEl.insertAdjacentHTML('beforeend', this.renderDay(date, date.getDate()));

      const dayEl = this.rootEl.lastElementChild as HTMLElement;
      dayEl.addEventListener('click', (e: MouseEvent) => {
        // @ts-ignore
        this.dispatchEvent(new CustomEvent('day-clicked', {detail: date}));
      });
    }

    this.updateNowMarker();
  }

  renderDay(date: Date, dayNumber: number, className: string = ''): string {
    const events = getEventsForDay(this._events, date);
    const isToday = date.toDateString() === new Date().toDateString();

    return `
      <div class="day ${isToday ? 'today' : ''} ${className}">
        <div class="header">
          <span class="day-name">${DAYS[date.getDay()]}</span>
          <span class="day-number">${dayNumber}</span>
        </div>
        <ul class="events">
          ${events.map(event => event.asMediumLengthHTML()).join('')}
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
