import { CalendarEvent } from "./CalendarEvent";

async function fetchData() {
  // Simulate a slower API endpoint call.
  console.log("Fetching calendar data ...");
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
  // Adding a cache buster to the URL to force a reload of the data.
  const response = await fetch(`./data.json?cacheBuster=${Date.now()}`);
  return await response.json();
}

function createOneOrMultipleEventsFromData(eventData: any): CalendarEvent[] {  
  const dates: Date[] = [new Date(eventData.startDate)];
  let multiDays: {start: Date, end: Date}|null = null;

  if (eventData.repeat) {
    const startDate = new Date(eventData.startDate);

    // If this event is repeated, it must have an end date.
    const endDate = eventData.endDate
      // Either the end date is specified.
      ? new Date(eventData.endDate)
      // Or it's 5 year after the start date.
      : new Date(startDate.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

    if (eventData.repeat === "daily") {
      console.log("Expanding daily event ...");
      const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      for (let i = 1; i <= days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        // If date is on a week end, skip it.
        if (date.getDay() === 0 || date.getDay() === 6) {
          continue;
        }

        dates.push(date);
      }
    } else if (eventData.repeat === "weekly") {
      console.log("Expanding weekly event ...");
      const weeks = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
      for (let i = 1; i <= weeks; i++) {
        const date = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        dates.push(date);
      }
    } else if (eventData.repeat === "monthly") {
      console.log("Expanding monthly event ...");
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
      for (let i = 1; i <= months; i++) {
        const date = new Date(startDate.getTime());
        date.setMonth(date.getMonth() + i);
        dates.push(date);
      }
    } else if (eventData.repeat === "yearly") {
      console.log("Expanding yearly event ...");
      const years = endDate.getFullYear() - startDate.getFullYear();
      for (let i = 1; i <= years; i++) {
        const date = new Date(startDate.getTime());
        date.setFullYear(date.getFullYear() + i);
        dates.push(date);
      }
    }
  } else if (eventData.endDate) {
    // If this event has a start and end date, but isn't repeated.
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    for (let i = 1; i <= days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(date);
    }
    multiDays = {start: startDate, end: endDate};
  }


  return dates.map((date, index) => {
    const id = eventData.id + (index > 0 ? `-${index}` : "");
    const event = new CalendarEvent(eventData.title, id, date);

    event.multiDays = multiDays;

    event.color = eventData.color;
    event.time = eventData.startTime;
    event.duration = eventData.duration;
    event.repeat = eventData.repeat;
    event.location = eventData.location;
    event.description = eventData.description;
    event.rsvp = eventData.rsvp;

    return event;
  });
}

export async function getAllEvents(): Promise<CalendarEvent[]> {
  const data = await fetchData();

  console.log("Processing events ...");
  return data.events.map((event: any) => {
    return createOneOrMultipleEventsFromData(event);
  }).flat();
}
