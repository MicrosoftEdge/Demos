import { AppUI } from "./AppUI";
import { getAllEvents } from "./events-factory";
import { EventPopup } from "./EventPopup";
import { Store } from "./Store";

addEventListener("DOMContentLoaded", async () => {
  const store = new Store();
  const prefs = await store.getStoredPrefs();

  // This is what the calendar will be centered around on load.
  const initDate = prefs.initDate || new Date();
  const initMode = prefs.mode || "month";

  const appEl = document.getElementById('app');
  const appUI = new AppUI(appEl!, initDate, initMode, []);

  const events = await getAllEvents()

  console.log("Refreshing calendar with events");
  appUI.events = events;

  console.log("Initializing the popup util");
  const popup = new EventPopup(events);
  popup.start();

  // @ts-ignore
  appUI.addEventListener("mode-changed", (e: CustomEvent) => {
    store.mode = e.detail;
  });

  // @ts-ignore
  appUI.addEventListener("date-changed", (e: CustomEvent) => {
    store.initDate = e.detail;
  });
});
