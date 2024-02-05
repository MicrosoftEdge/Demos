import { CalendarEvent } from "./CalendarEvent";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

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

export function formatMonthYear(date: Date): string {
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${MONTHS[month]} ${year}`;
}

export function isInBrowserSidePanel(): boolean {
  // @ts-ignore
  return !!navigator.userAgentData && navigator.userAgentData.brands.some(brand => {
    return brand.brand.toLowerCase().includes("side panel");
  });
}
