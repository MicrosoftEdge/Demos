self.addEventListener('fetch', event => {});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

self.addEventListener('message', (e) => {
  const { reminder, timeMs } = e.data;

  const timer = wait(timeMs).then(() => {
    // e.source.postMessage('timer ended');
    self.registration.showNotification('Reminder', {
      body: `It's time to ${reminder}`,
      icon: 'icons512.png'
    });
  });

  e.waitUntil(timer);
});
