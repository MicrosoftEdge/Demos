self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // If we're navigating to a flow page, redirect to the home page
  // and ask it to do the SPA navigation instead.
  const isFlowUrl = url.pathname.startsWith('/wami/flow/');
  if (isFlowUrl) {
    const id = url.pathname.substring('/wami/flow/'.length);
    event.respondWith(Response.redirect(`./?loadFlow=${id}`));
  }
});