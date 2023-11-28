export class CalendarEvent {
  title: string;
  id: string;
  date: Date;
  time: string|undefined;
  duration: number|undefined;
  repeat: string|undefined;
  description: string|undefined;
  color: string|undefined;
  location: string|undefined;
  multiDays: {start: Date, end: Date}|null;
  rsvp: boolean = false;

  constructor(title: string, id: string, date: Date) {
    this.title = title;
    this.id = id;
    this.date = date;
  }

  asOneLineHTML(indexInGrid: number|undefined = undefined): string {
    const time = this.time ? `<span class="time">${this.time}</span>` : '';

    return `
      <li id="id-${this.id}" data-index-in-grid="${indexInGrid}" class="event${!!this.multiDays ? " multi-day" : ""}${this.rsvp ? "" : " unconfirmed"}" style="--event-color: ${this.color};">
        <div>${time} <span class="title">${this.title}</span></div>
      </li>
    `;
  }

  asMediumLengthHTML(): string {
    const time = this.time ? `<span class="time">${this.time}</span>` : '';

    return `
      <li id="id-${this.id}" class="event${!!this.multiDays ? " multi-day" : ""}${this.rsvp ? "" : " unconfirmed"}" style="--event-color: ${this.color};">
        <div>${time}</div>
        <p class="title">${this.title}</p>
        <p>${this.description}</p>
      </li>
    `;
  }

  asFullHTML(): string {
    let when = "";
      
    if (!this.multiDays) {
      when = this.date.toDateString();
      if (this.time) {
        when += `, at ${this.time}`;
      }
      if (this.repeat) {
        when += `, ${this.repeat}`;
      }
      if (this.duration) {
        when += ` (${this.duration} minutes)`;
      }
    } else {
      when = `From ${this.multiDays.start.toDateString()} to ${this.multiDays.end.toDateString()}`;
    }

    return `
      <li class="event${this.rsvp ? "" : " unconfirmed"}" style="--event-color: ${this.color};">
        <div>
          <h2>${this.title}</h2>
          <p class="when">${when}</p>
          ${this.location ? `<p class="where">${this.location}</p>` : ""}
          <p class="what">${this.description}</p>
        </div>
      </li>
    `;
  }
}
