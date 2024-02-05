import { EventTarget, Event } from "event-target-shim";
import { CalendarEvent } from "./CalendarEvent";
import { getEventsForDay, formatMonthYear } from "./utils";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November','December'
];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class DayGrid extends EventTarget {
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
    const events = getEventsForDay(this._events, this._date);

    this.rootEl.innerHTML = `
      <div class="day">
        <div class="header">
          ${DAYS[this._date.getDay()]}, ${this._date.getDate()}, ${formatMonthYear(this._date)}
        </div>
        <ul class="events">
          ${events.map(event => event.asMediumLengthHTML()).join('')}
        </ul>
      </div>
    `;

    this.updateNowMarker();
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
