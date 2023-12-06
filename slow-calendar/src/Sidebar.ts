import { CalendarEvent } from "./CalendarEvent";

export class Sidebar {
  private rootEl: HTMLElement;
  private _events: CalendarEvent[] = [];
  private _date: Date = new Date();

  constructor(private el: HTMLElement, date: Date, events: CalendarEvent[]) {
    this.rootEl = el;
    this._date = date;
    this._events = events;

    this.render();
  }
  
  render() {
    this.rootEl.innerHTML = `
      <h2>Click a day to view events</h2>
    `;

    if (!this._events.length) {
      return;
    }

    this.rootEl.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'events';
    this.rootEl.appendChild(ul);

    for (const event of this._events) {
      ul.innerHTML += event.asFullHTML();
    }
  }

  set events(events: CalendarEvent[]) {
    this._events = events;
    this.render();
  }
}
