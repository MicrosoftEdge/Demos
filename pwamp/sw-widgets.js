const WIDGET_TAG = 'pwamp';

// Storing our template and initial data locally.
// These will be set the first time the widget is installed.
// See renderEmptyWidget.
let template = null;
let templateActions = [];
let initialData = null;

async function sendClientMessage(data) {
  const allClients = await clients.matchAll({
    includeUncontrolled: true,
    type: 'all'
  });
  allClients.forEach(client => {
    client.postMessage(data);
  });
}

// Make sure to update the widget to its initial state  when
// the service worker is activated.
// Widgets may be installed before a SW is activated, and if we
// don't update it now, it will be empty.
self.addEventListener('activate', (event) => {
  event.waitUntil(renderEmptyWidget());
});

// Listen to the widgetinstall event in order to update the widget
// when it gets installed the first time.
self.addEventListener('widgetinstall', (event) => {
  event.waitUntil(renderEmptyWidget(event));
});

// Listen to the widgetclick event to react to user actions in the widget.
self.addEventListener('widgetclick', (event) => {
  switch (event.action) {
    case 'next':
      event.waitUntil(sendClientMessage({ action: 'next' }));
      break;
    case 'previous':
      event.waitUntil(sendClientMessage({ action: 'previous' }));
      break;
  }
});

// Listen to messages from the clients to also update
// the widget when a song is playing or when we're paused.
self.onmessage = (event) => {
  switch (event.data.action) {
    case 'playing':
      event.waitUntil(renderPlayingStateWidget(event.data));
      break;
    case 'paused':
      event.waitUntil(renderEmptyWidget());
      break;
  }
};

async function renderEmptyWidget(event) {
  if (!self.widgets) {
    return;
  }

  if (!template && event && event.widget) {
    // If an event is passed, then that's a WidgetEvent
    // and we can use it to access the widget template and data.
    // and store them locally for later use.
    template = await (await fetch(event.widget.definition.msAcTemplate)).json();
    // We store those separately so we can add/remove them when we want.
    templateActions = template.actions;
    initialData = await (await fetch(event.widget.definition.data)).json();
  } else if (!template && !event) {
    // If, by any chance we don't have an event and nothing was
    // stored locally (which shouldn't happen), then we can
    // get the widget definition and get the info this way.
    const widget = await self.widgets.getByTag(WIDGET_TAG);
    // The widget might not have been installed yet. Bail out.
    if (!widget) {
      return;
    }

    template = await (await fetch(widget.definition.msAcTemplate)).json();
    // We store those separately so we can add/remove them when we want.
    templateActions = template.actions;
    initialData = await (await fetch(widget.definition.data)).json();
  }

  // Disable the actions.
  template.actions = [];

  try {
    await self.widgets.updateByTag(WIDGET_TAG, {
      template: JSON.stringify(template),
      data: JSON.stringify(initialData)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}

async function renderPlayingStateWidget(data) {
  if (!self.widgets || !template) {
    return;
  }

  // Enable the actions.
  template.actions = templateActions;

  const payload = {
    template: JSON.stringify(template),
    data: JSON.stringify(data)
  };

  try {
    await self.widgets.updateByTag(WIDGET_TAG, payload);
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}
