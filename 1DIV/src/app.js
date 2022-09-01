import * as monaco from 'monaco-editor';

require('./playground');
const { Store } = require('./store');

let editor = null;
let selectedPlayground = null;
let currentPlayground = null;
let currentId = null;
let isResizing = false;

const colorEl = document.querySelector('input[type="color"]');
const demosEl = document.querySelector('.demos .grid');
const newEl = document.querySelector('.new');
const closeEl = document.querySelector('.close');
const demoNameEl = document.querySelector('.demo-name');
const searchFieldEl = document.querySelector('.search-field');
const delEl = document.querySelector('.delete');
const resizerEl = document.querySelector('.resizer');

const store = new Store();

const INITIAL_COLOR = '#21558C';
const INITIAL_CODE = `
/*
This is your new 1DIV!

You have a single element to style:
<div class="a"></div>
So get creative with CSS!

You can't style the body or html elements. If you
want to change the background color, use the color
picker button in the bottom-right corner.

Useful tips:
- Use % units so your demo works in any container size.
- The 1DIV is set up in a way where 1em is always 1% of the width.
- Use multiple background-images to draw shapes.
- Use ::before/::after pseudo-elements.
- Use multiple box-shadows to duplicate shapes.
- The background color you chose is also available with var(--bg-color).
*/

.a {
  --color: gold;
  width: 50%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color);
  box-shadow:
    inset 0 0 0 10em var(--color),
    inset 0 0 0 20em var(--bg-color),
    inset 0 0 0 30em var(--color),
    inset 0 0 0 40em var(--bg-color);
}`;

function updatePlayground(cssText, bgColor, el) {
  el.color = bgColor;
  el.css = cssText;

  if (bgColor) {
    el.style.backgroundColor = bgColor;

    colorEl.value = bgColor;
  }
}

function themeWindow(bgColor) {
  document.querySelector("meta[name=theme-color]").setAttribute('content', bgColor);
}

editor = monaco.editor.create(document.querySelector('.code'), {
  theme: 'vs-dark',
  model: monaco.editor.createModel(INITIAL_CODE, 'css'),
  wordWrap: 'off',
  minimap: {
    enabled: false
  },
  scrollbar: {
    vertical: 'auto'
  }
});

editor.getModel().onDidChangeContent(async () => {
  if (!selectedPlayground || !currentPlayground) {
    return;
  }

  const color = colorEl.value;

  updatePlayground(editor.getValue(), color, selectedPlayground);
  updatePlayground(editor.getValue(), color, currentPlayground);

  await store.set(currentId, editor.getValue(), colorEl.value);
});

// Re-layout on resize.
window.onresize = () => editor.layout();

// Response to color changes.
colorEl.addEventListener('input', async () => {
  if (!selectedPlayground || !currentPlayground) {
    return;
  }

  const color = colorEl.value;

  updatePlayground(editor.getValue(), color, selectedPlayground);
  updatePlayground(editor.getValue(), color, currentPlayground);
  themeWindow(color);

  await store.set(currentId, editor.getValue(), color);
});

// Populate the list of demos.
async function refreshAllStoredDemos() {
  demosEl.innerHTML = '';

  const demos = await store.getAll();

  for (const id in demos) {
    const { name, bgColor, cssText } = demos[id];

    const li = createDemo(id, name, bgColor, cssText);
    demosEl.appendChild(li);
  }
}

refreshAllStoredDemos();

function createDemo(id, name, bgColor, cssText) {
  const li = document.createElement('li');
  li.classList.add('demo');
  li.dataset.id = id;
  li.setAttribute('title', 'Edit this 1DIV');

  const playground = document.createElement('css-playground');
  updatePlayground(cssText, bgColor, playground);

  li.appendChild(playground);

  const h2 = document.createElement('h2');
  h2.textContent = name || 'Untitled';
  li.appendChild(h2);

  return li;
}

// Wire the new button.
newEl.addEventListener('click', async () => {
  const bgColor = INITIAL_COLOR;
  const cssText = INITIAL_CODE;

  const id = await store.createNew(cssText, bgColor);
  const li = createDemo(id, null, bgColor, cssText);
  demosEl.appendChild(li);

  await launchDemo(li);
});

// Load a demo on click.
addEventListener('click', async e => {
  const demo = e.target.closest('.demo');
  if (!demo) {
    return;
  }

  await launchDemo(demo);
});

async function launchDemo(demoEl) {
  currentId = demoEl.dataset.id;

  const data = await store.get(currentId);
  if (!data) {
    return;
  }
  const { name, bgColor, cssText } = data;

  editor.setValue(data.cssText);

  demoNameEl.value = name || 'Untitled';

  // Clone the css-playground and append it to the body so we can
  // make it full-size.
  selectedPlayground = demoEl.querySelector('css-playground');

  const rect = selectedPlayground.getBoundingClientRect();

  currentPlayground = document.createElement('css-playground');
  currentPlayground.style = `top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px;`;
  currentPlayground.classList.add('selected');

  updatePlayground(cssText, bgColor, currentPlayground);
  themeWindow(bgColor);

  document.body.appendChild(currentPlayground);
  document.body.classList.add('demo-selected');

  // Force a reflow so the selected class is added independently from the full-size class. Not batched by the browser.
  const forceReflow = currentPlayground.offsetWidth;
  currentPlayground.classList.add('full-size');

  return new Promise(r => {
    currentPlayground.addEventListener('transitionend', () => {
      currentPlayground.classList.remove('selected');
      r();
    }, {once: true});
  });
}

async function closeDemo() {
  if (!currentPlayground || !selectedPlayground) {
    return;
  }

  currentPlayground.classList.add('selected');

  // Update the zoomed-out rect coordinates in case the window was resized.
  const rect = selectedPlayground.getBoundingClientRect();
  currentPlayground.style = `background-color:${selectedPlayground.style.backgroundColor};top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px;`;

  themeWindow('white');

  document.body.classList.remove('demo-selected');

  currentPlayground.classList.remove('full-size');

  return new Promise(r => {
    currentPlayground.addEventListener('transitionend', () => {
      if (!currentPlayground) {
        return;
      }
      currentPlayground.remove();

      currentPlayground = null;
      selectedPlayground = null;
      currentPlayground = null;

      r();
    }, {once: true});
  });
}

// Change the zoom level
addEventListener('click', e => {
  const button = e.target.closest('.zoom button');
  if (!button) {
    return;
  }

  const level = button.className.substring(5);
  demosEl.setAttribute('zoom-level', level);
});

// Close a demo
closeEl.addEventListener('click', async () => {
  await closeDemo();
});

// Rename a demo
demoNameEl.addEventListener('input', async () => {
  if (!currentPlayground) {
    return;
  }

  await store.setName(currentId, demoNameEl.value);
  selectedPlayground.nextElementSibling.textContent = demoNameEl.value;
});

// Search for demos
searchFieldEl.addEventListener('input', () => {
  demosEl.querySelectorAll('h2').forEach(h2 => {
    const demo = h2.parentNode;
    const matches = h2.textContent.toLowerCase().includes(searchFieldEl.value.toLowerCase());
    demo.classList.toggle('hidden', !matches);
  });
});

// Delete a demo
delEl.addEventListener('click', async () => {
  if (!currentPlayground) {
    return;
  }

  const demoToDelete = selectedPlayground.parentNode;

  await store.delete(currentId);
  await closeDemo();

  demoToDelete.classList.add('deleting');
  demoToDelete.addEventListener('transitionend', () => {
    demoToDelete.remove();
  });
});

// Don't try to squeeze our own titlebar if the window is too narrow.
if (navigator.windowControlsOverlay) {
  navigator.windowControlsOverlay.addEventListener('geometrychange', () => {
    const { width } = navigator.windowControlsOverlay.getTitlebarAreaRect();

    // Yes, we could do this with a media-query, but we only care
    // if the window-controls-overlay feature is being used.
    document.body.classList.toggle('narrow', width < 250);
  });
}

// Resize the editor on resizer drag.
resizerEl.addEventListener('mousedown', e => {
  if (isResizing) {
    return;
  }

  isResizing = true;
  document.documentElement.style.userSelect = 'none';
});

addEventListener('mouseup', e => {
  if (!isResizing) {
    return;
  }

  isResizing = false;
  document.documentElement.style.userSelect = 'auto';
});

addEventListener('mousemove', e => {
  if (!isResizing) {
    return;
  }

  const topOffset = e.clientY;
  document.documentElement.style.setProperty('--edited-demo-height', topOffset + 'px');
  editor.layout();
});
