import { CalendarEvent } from "./CalendarEvent";

export class EventPopup {
  private popupEl: HTMLElement|undefined;

  constructor(private events: CalendarEvent[]) {}

  start() {
    if (!this.popupEl) {
      this.popupEl = document.createElement("div");
      this.popupEl.className = "popup";
    }
    
    addEventListener("mousemove", (e: MouseEvent) => {
      this.popupEl.classList.remove("visible");
      this.popupEl.remove();

      const eventEl = (e.target as HTMLElement).closest("#month-grid .event, #week-grid .event") as HTMLElement;
      if (!eventEl) {
        return;
      }

      const id = eventEl.id;

      if (!id || !id.startsWith("id-")) {
        return;
      }

      let eventId = id.replace("id-", "");

      const event = this.events.find(event => event.id === eventId);      
      if (!event) {
        console.log("No event found for id", eventId);
        return;
      }

      const eventIndexInGrid = parseInt(eventEl.dataset.indexInGrid!);

      this.popupEl.style.setProperty("--event-color", event.color);
      this.popupEl.classList.toggle("visible", true);
      this.popupEl.classList.toggle("unconfirmed", !event.rsvp);

      let when = "";
      
      if (!event.multiDays) {
        when = event.date.toDateString();
        if (event.time) {
          when += `, at ${event.time}`;
        }
        if (event.repeat) {
          when += `, ${event.repeat}`;
        }
        if (event.duration) {
          when += ` (${event.duration} minutes)`;
        }
      } else {
        when = `From ${event.multiDays.start.toDateString()} to ${event.multiDays.end.toDateString()}`;
      }

      this.popupEl.innerHTML = `
        <h2>${event.title}</h2>
        <p class="when">${when}</p>
        ${event.location ? `<p class="where">${event.location}</p>` : ""}
        <p class="what">${event.description}</p>
      `;

      document.body.appendChild(this.popupEl);

      // Get the coordinates of the event element.
      const rect = eventEl.getBoundingClientRect();
      const top = rect.top;
      const right = rect.right;
      const left = rect.left;
      const width = rect.width;

      if (eventIndexInGrid >= 28) {
        // The event is in the last 2 rows. Show the popup above it.
        this.popupEl.style.top = `${top - this.popupEl.clientHeight}px`;
      } else {
        this.popupEl.style.top = `${top}px`;
      }

      if (eventIndexInGrid === 6 || eventIndexInGrid === 13 || eventIndexInGrid === 20 || eventIndexInGrid === 27 || eventIndexInGrid === 34) {
        // The event is last in a row, so we want to show the popup to the left of it.
        this.popupEl.style.left = `${left - width}px`;
        this.popupEl.classList.toggle("left", true);
      } else {
        this.popupEl.style.left = `${right}px`;
        this.popupEl.classList.toggle("left", false);
      }
    });
  }
}
