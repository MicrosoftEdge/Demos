import { EventTarget, Event } from "event-target-shim";
import { CalendarEvent } from "./CalendarEvent";
import { MonthGrid } from "./MonthGrid";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { getEventsForDay } from "./utils";
import { WeekGrid } from "./WeekGrid";

export class AppUI extends EventTarget {
  private rootEl: HTMLElement;

  private monthGridEl: HTMLElement;
  public monthGrid: MonthGrid;

  private weekGridEl: HTMLElement;
  public weekGrid: WeekGrid;

  private toolbarEl: HTMLElement;
  private toolbar: Toolbar;

  private sidebarEl: HTMLElement;
  private sidebar: Sidebar;

  private _date: Date;
  private _events: CalendarEvent[];

  private mode: string = "month";

  constructor(el: HTMLElement, date: Date, mode: string, events: CalendarEvent[]) {
    super();

    this.rootEl = el;
    this._date = date;
    this._events = events;
    this.mode = mode;

    this.render();
  }

  render() {
    this.rootEl.innerHTML = '';

    // Create an element for the toolbar.
    this.toolbarEl = document.createElement('div');
    this.toolbarEl.id = 'toolbar';
    this.rootEl.appendChild(this.toolbarEl);

    // Init the toolbar component in it.
    this.toolbar = new Toolbar(this.toolbarEl, this._date, this.mode);

    this.toolbar.addEventListener('prev', () => {
      const newDate = this.mode === "month"
        ? new Date(this._date.getFullYear(), this._date.getMonth() - 1, 1)
        : new Date(this._date.getFullYear(), this._date.getMonth(), this._date.getDate() - 7);
      this.date = newDate;

      // @ts-ignore
      this.dispatchEvent(new CustomEvent('date-changed', {detail: this._date}));
    });
    
    this.toolbar.addEventListener('next', () => {
      const newDate = this.mode === "month"
        ? new Date(this._date.getFullYear(), this._date.getMonth() + 1, 1)
        : new Date(this._date.getFullYear(), this._date.getMonth(), this._date.getDate() + 7);
      this.date = newDate;

      // @ts-ignore
      this.dispatchEvent(new CustomEvent('date-changed', {detail: this._date}));
    });
    
    this.toolbar.addEventListener('today', () => {
      this.date = new Date();
      
      // @ts-ignore
      this.dispatchEvent(new CustomEvent('date-changed', {detail: this._date}));
    });

    this.toolbar.addEventListener('month-view', () => {
      this.mode = "month";
      this.monthGridEl.style.display = 'grid';
      this.weekGridEl.style.display = 'none';

      // @ts-ignore
      this.dispatchEvent(new CustomEvent('mode-changed', {detail: this.mode}));
    });
    
    this.toolbar.addEventListener('week-view', () => {
      this.mode = "week";
      this.monthGridEl.style.display = 'none';
      this.weekGridEl.style.display = 'grid';

      // @ts-ignore
      this.dispatchEvent(new CustomEvent('mode-changed', {detail: this.mode}));
    });

    // Create an element for the month grid.
    this.monthGridEl = document.createElement('div');
    this.monthGridEl.id = 'month-grid';
    this.rootEl.appendChild(this.monthGridEl);

    // Init the month grid component in it.
    this.monthGrid = new MonthGrid(this.monthGridEl, this._date, this._events);

    // Create an element for the week grid.
    this.weekGridEl = document.createElement('div');
    this.weekGridEl.id = 'week-grid';
    this.rootEl.appendChild(this.weekGridEl);

    // Init the week grid component in it.
    this.weekGrid = new WeekGrid(this.weekGridEl, this._date, this._events);

    // Create an element for the sidebar.
    this.sidebarEl = document.createElement('div');
    this.sidebarEl.id = 'sidebar';
    this.rootEl.appendChild(this.sidebarEl);

    // Init the sidebar component in it.
    this.sidebar = new Sidebar(this.sidebarEl, this._date, this._events);

    // Listen for day-clicked events from the month and week grids to show the full
    // list in the sidebar.
    // @ts-ignore
    this.monthGrid.addEventListener('day-clicked', (e: CustomEvent) => {
      const date = e.detail;
      const events = getEventsForDay(this._events, date);
      this.sidebar.events = events;
    });
    // @ts-ignore
    this.weekGrid.addEventListener('day-clicked', (e: CustomEvent) => {
      const date = e.detail;
      const events = getEventsForDay(this._events, date);
      this.sidebar.events = events;
    });

    // Start with today.
    this.sidebar.events = getEventsForDay(this._events, new Date());

    // Show/hide the right mode
    if (this.mode === "week") {
      this.monthGridEl.style.display = 'none';
      this.weekGridEl.style.display = 'grid';
    } else {
      this.monthGridEl.style.display = 'grid';
      this.weekGridEl.style.display = 'none';
    }
  }

  set date(date: Date) {
    console.log("Setting date to", date);
    this._date = date;
    this.monthGrid.date = date;
    this.weekGrid.date = date;
    this.toolbar.date = date;
    this.sidebar.events = getEventsForDay(this._events, this._date);
  }

  set events(events: CalendarEvent[]) {
    this._events = events;
    this.monthGrid.events = events;
    this.weekGrid.events = events;
    this.sidebar.events = getEventsForDay(this._events, this._date);
  }
}
