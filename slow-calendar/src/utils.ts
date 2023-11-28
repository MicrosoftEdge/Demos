import { CalendarEvent } from "./CalendarEvent";

export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    return event.date.getFullYear() === date.getFullYear() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getDate() === date.getDate();
  }).sort((a, b) => {
    // If one has no time property, it should be first.
    // If both have no time, no sorting is needed.
    if (!a.time && !!b.time) {
      return -1;
    } else if (!!a.time && !b.time) {
      return 1;
    } else if (!a.time && !b.time) {
      return 0;
    }

    // Sort the events by time. Times are strings in 24
    // formats, so just remove the leading 0, if any, and
    // the colon, and compare the numbers.
    const aTime = parseInt(a.time.replace(/^0/, '').replace(':', ''));
    const bTime = parseInt(b.time.replace(/^0/, '').replace(':', ''));
    return aTime - bTime;
  }).sort((a, b) => {
    // Sort the events that are multi-days first.
    if (!!a.multiDays && !b.multiDays) {
      return -1;
    } else if (!a.multiDays && !!b.multiDays) {
      return 1;
    }
  });
}
