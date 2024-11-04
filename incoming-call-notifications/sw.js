"use strict";

skipWaiting();

onactivate = () => {
  return clients.claim();
};

onmessage = (messageEvent) => {
  registration
    .showNotification(`ServiceWorkerGlobalScope Title ${messageEvent.data}`, {
      body: `ServiceWorkerGlobalScope Body ${messageEvent.data}`,
      icon: "../resources/happy.jpg",
    })
    .then(() => {
      messageEvent.source.postMessage(
        "ServiceWorkerGlobalScope showNotification() succeeded."
      );
    })
    .catch((error) => {
      messageEvent.source.postMessage(
        `ServiceWorkerGlobalScope showNotification() failed: ${error}.`
      );
    });
};

onnotificationclick = (event) => {
  const notification = event.notification;

  clients.matchAll().then((resultList) => {
    resultList.forEach((client) => {
      client.postMessage(
        `ServiceWorkerGlobalScope 'click' event for: ${
          notification.title
        } , timestamp: ${new Date(
          notification.timestamp
        )}, requireInteraction: ${notification.requireInteraction}, silent: ${
          notification.silent
        }`
      );
      notification.close();
    });
  });

  if (event.action === "open_window") {
    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(() => {
          clients.openWindow("on-click.html");
          resolve();
        }, 0);
      })
    );
  } else {
    // Focus existing client.
    event.waitUntil(
      clients.matchAll().then((resultList) => {
        if (resultList.length > 0) {
          return resultList[0].focus();
        }
      })
    );
  }
};

onnotificationclose = (event) => {
  clients.matchAll().then((resultList) => {
    resultList.forEach((client) => {
      const notification = event.notification;
      client.postMessage(
        `ServiceWorkerGlobalScope 'close' event for: ${
          notification.title
        } , timestamp: ${new Date(
          notification.timestamp
        )}, requireInteraction: ${notification.requireInteraction}, silent: ${
          notification.silent
        }`
      );
    });
  });
};

onfetch = (fetchEvent) => {
  console.log(fetchEvent.request.url);
  fetchEvent.respondWith(fetch(fetchEvent.request));
};
