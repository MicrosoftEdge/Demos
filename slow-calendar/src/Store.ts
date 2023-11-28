export class Store {
  async getStoredPrefs(): Promise<{mode: string, initDate: Date|undefined}> {
    // Fake some random time (up to 250ms) to simulate an API call.
    await new Promise(resolve => setTimeout(resolve, Math.random() * 250));

    const mode = localStorage.getItem('slow-cal-mode');
    const initDate = localStorage.getItem('slow-cal-initDate');

    return {
      mode,
      initDate: initDate ? new Date(initDate) : undefined
    };
  }

  set mode(mode: string) {
    console.log("Storing mode prefs");
    localStorage.setItem('slow-cal-mode', mode);
  }

  set initDate(date: Date) {
    console.log("Storing date prefs");
    localStorage.setItem('slow-cal-initDate', date.toISOString());
  }
}
