self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("sync", event => {
  if (event.tag.startsWith("retry-message-")) {
    event.waitUntil((async () => {

      const clients = await self.clients.matchAll();

      if (clients && clients.length) {
        //Respond to last focused tab
        clients[0].postMessage({ type: "retry-message", tag: event.tag });
      }

    })());
  }
});
