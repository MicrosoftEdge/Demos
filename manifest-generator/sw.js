self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      // To-do: useful offline experience.
      return new Response("Hello offline page");
    })
  );
});
