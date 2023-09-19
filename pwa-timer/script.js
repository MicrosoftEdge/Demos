const formEl = document.querySelector('form');
const reminderEl = document.getElementById('reminder');
const timeEl = document.getElementById('time-qty');
const timeUnitEl = document.getElementById('time-unit');
const timerBtn = document.getElementById('set-timer');
const timersListEl = document.querySelector('.timers');

if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const timeQty = parseInt(timeEl.value, 10);
  if (isNaN(timeQty)) {
    return;
  }

  const reminder = reminderEl.value;
  const timeUnit = timeUnitEl.value;
  let timeMs = 0;
  if (timeUnit === "seconds") {
    timeMs = timeQty * 1000;
  } else if (timeUnit === "minutes") {
    timeMs = timeQty * 1000 * 60;
  } else if (timeUnit === "hours") {
    timeMs = timeQty * 1000 * 60 * 60;
  }

  scheduleTimer(reminder, timeQty, timeUnit, timeMs); 
  addTimerUI(reminder, timeQty, timeUnit);
});

function addTimerUI(reminder, timeQty, timeUnit) {
  const li = document.createElement('li');
  li.innerHTML = `
    Remember to
    <span class="reminder">${reminder}</span>
    in
    <span class="time">${timeQty} ${timeUnit}</span>
  `;
  timersListEl.appendChild(li);
}

function onTimerEnd(reminder) {
  new Notification('Reminder', {
    body: `It's time to ${reminder}`,
    icon: 'icons512.png'
  });
}

const schedulerStrategies = {
  setTimeout: (reminder, timeQty, timeUnit, timeMs) => {  
    setTimeout(() => {
      onTimerEnd(reminder);
    }, timeMs);
  },

  webWorker: (reminder, timeQty, timeUnit, timeMs) => {
    const worker = new Worker('worker.js');
    worker.postMessage({
      reminder,
      timeQty,
      timeUnit,
      timeMs
    });
    worker.addEventListener('message', (e) => {
      onTimerEnd(reminder);
    });
  },

  serviceWorker: (reminder, timeQty, timeUnit, timeMs) => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage({
        reminder,
        timeQty,
        timeUnit,
        timeMs
      });
    });
    navigator.serviceWorker.addEventListener('message', (e) => {
      onTimerEnd(reminder);
    });
  }
};

function scheduleTimer(reminder, timeQty, timeUnit, timeMs) {
  const scheduler = schedulerStrategies.serviceWorker;
  scheduler(reminder, timeQty, timeUnit, timeMs);
}
