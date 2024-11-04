"use strict";

skipWaiting();

onactivate = () => {
  return clients.claim();
};

onfetch = (fetchEvent) => {
  console.log(fetchEvent.request.url);
  fetchEvent.respondWith(fetch(fetchEvent.request));
};

onnotificationclick = (event) => {
  clients.matchAll().then((resultList) => {
    resultList.forEach((client) => {
      const notification = event.notification;
      client.postMessage(
        `Service-worker: Action '${event.action}' for: ${notification.title}`
      );
    });
  });
};
