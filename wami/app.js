import { runFlow } from './flow-runner.js';
import { populateEditor, populateFlowList, populateOutputImages, insertStep, removeStep, populateInputImages } from './ui.js';
import { getFlows, saveFlows } from './store.js';
import { getUniqueId, extractImagesFromDataTransfer, download } from './utils.js';

const welcomePage = document.querySelector('.welcome');
const editorPage = document.querySelector('.editor');
const imagesPage = document.querySelector('.images');
const runFlowButton = document.querySelector('.run-flow');
const addFlowButton = document.querySelector('.add-flow');
const deleteFlowButton = document.querySelector('.delete-flow');
const downloadImagesButton = document.querySelector('.download-images');
const saveImagesButton = document.querySelector('.save-images');
const useOutputAsInputButton = document.querySelector('.use-output-as-input');

let flowsPromise = getFlows();
let currentFlow = null;
let currentId = null;
let currentImages = [];
let outputImages = [];

function shouldNotIntercept(navigationEvent) {
  return (
    // If we can't intercept, let the navigation go through.
    !navigationEvent.canIntercept ||
    // If this is not in the wami scope, let the navigation go through.
    new URL(navigationEvent.destination.url).pathname.indexOf('/wami') !== 0 ||
    // If this is just a hashChange,
    // just let the browser handle scrolling to the content.
    navigationEvent.hashChange ||
    // If this is a download,
    // let the browser perform the download.
    navigationEvent.downloadRequest ||
    // If this is a form submission,
    // let that go to the server.
    navigationEvent.formData
  );
}

// On navigate event, intercept the navigation to the home page and the flow page.
// Hide/show the right DOM elements, and set the currentId and currentFlow variables.
navigation.addEventListener('navigate', navigateEvent => {
  if (shouldNotIntercept(navigateEvent)) {
    return;
  }

  const url = new URL(navigateEvent.destination.url);

  if (url.pathname === '/wami/') {
    navigateEvent.intercept({
      async handler() {
        currentFlow = null;
        currentId = null;

        welcomePage.classList.remove('hidden');
        editorPage.classList.add('hidden');
        imagesPage.classList.add('hidden');

        document.querySelectorAll(`.flow-in-list.selected`).forEach(f => f.classList.remove('selected'));
      }
    });
  } else if (url.pathname.startsWith('/wami/flow/')) {
    navigateEvent.intercept({
      async handler() {
        const id = url.pathname.substring('/wami/flow/'.length);
        currentId = id;
        const flows = await flowsPromise;
        currentFlow = flows.find(f => id === f.id + '');
        
        if (!currentFlow) {
          await navigation.navigate('/wami/');
          return;
        }

        welcomePage.classList.add('hidden');
        editorPage.classList.remove('hidden');
        imagesPage.classList.remove('hidden');

        // Mark the current flow as selected in the sidebar.
        document.querySelectorAll(`.flow-in-list.selected`).forEach(f => f.classList.remove('selected'));
        document.querySelector(`.flow-in-list[data-id="${id}"]`).classList.add('selected');

        populateEditor(currentFlow);
      }
    });
  }
});

// On start, we may be launched with the loadFlow query parameter.
// If so, redirect to /wami/flow/id
const url = new URL(document.location);
const flowToLoad = url.searchParams.get('loadFlow');
if (flowToLoad) {
  navigation.navigate(`/wami/flow/${flowToLoad}`);
}

// Run the current flow.
runFlowButton.addEventListener('click', async e => {
  if (!currentImages.length) {
    return;
  }

  populateOutputImages([]);
  document.documentElement.classList.add('running');

  const processedFiles = await runFlow(currentFlow, currentImages.map(i => {
    if (!i.file.name) {
      i.file.name = i.name;
    }
    return i.file;
  }));
  if (processedFiles) {
    // Store the new images in the outputImages array.
    outputImages = processedFiles.outputFiles;

    // Display the images.
    const imageSources = processedFiles.outputFiles.map(file => {
      return { src: URL.createObjectURL(file.blob), name: file.name };
    });
    populateOutputImages(imageSources, currentImages[0].fsHandlePromise);
  }

  document.documentElement.classList.remove('running');
});

// Handle flow changes.
addEventListener('change', async e => {
  if (e.target.closest('.editor')) {
    await handleFlowChange();
  }
});

addEventListener('flow-change', handleFlowChange);

async function handleFlowChange() {
  // Something changed in the editor.
  // Save the current flow to the local flows variable, and to the store.
  const stepElements = [...editorPage.querySelectorAll('.step')];
  currentFlow.steps = stepElements.map(stepElement => {
    const type = stepElement.dataset.type;
    const params = [...stepElement.querySelectorAll('.step-param input, .step-param select')].map(i => i.value);
    return { type, params };
  });

  const newName = editorPage.querySelector('.flow-name').value;
  const nameChanged = currentFlow.name !== newName;
  currentFlow.name = newName;

  const flows = await flowsPromise;
  const flowIndex = flows.findIndex(f => f.id === currentFlow.id);
  flows[flowIndex] = currentFlow;

  await saveFlows(flows);

  if (nameChanged) {
    populateFlowList(flows);
  }

  populateEditor(currentFlow);
}

// Adding a step to the current flow.
addEventListener('click', async e => {
  const addStepButton = e.target.closest('.editor .add-step');
  if (!addStepButton || !currentFlow) {
    return;
  }

  const index = parseInt(addStepButton.dataset.index, 10);
  await insertStep(index);

  handleFlowChange();
});

// Removing a step from the current flow.
addEventListener('click', e => {
  const removeStepButton = e.target.closest('.editor .step .remove-step');
  if (!removeStepButton || !currentFlow) {
    return;
  }

  const index = parseInt(removeStepButton.dataset.index, 10);
  removeStep(index);

  handleFlowChange();
});

// Adding a new flow.
addFlowButton.addEventListener('click', async e => {
  const flows = await flowsPromise;
  const newFlow = {
    id: getUniqueId(),
    name: 'Untitled flow',
    steps: []
  };

  flows.push(newFlow);
  await saveFlows(flows);

  populateFlowList(flows);

  await navigation.navigate(`/wami/flow/${newFlow.id}`);
});

// Deleting the current flow.
deleteFlowButton.addEventListener('click', async e => {
  const flows = await flowsPromise;
  const flowIndex = flows.findIndex(f => f.id === currentFlow.id);
  flows.splice(flowIndex, 1);
  await saveFlows(flows);

  populateFlowList(flows);

  await navigation.navigate('/wami/');
});

// Handle drag/drop images in the app.
addEventListener('dragover', e => {
  e.preventDefault();

  const images = extractImagesFromDataTransfer(e);
  if (!images.length) {
    return;
  }

  document.documentElement.classList.add('dropping-images');
});

addEventListener('dragleave', e => {
  e.preventDefault();

  const images = extractImagesFromDataTransfer(e);
  if (!images.length) {
    return;
  }

  document.documentElement.classList.remove('dropping-images');
});

addEventListener('drop', async (e) => {
  e.preventDefault();

  const images = extractImagesFromDataTransfer(e);
  if (!images.length) {
    return;
  }

  document.documentElement.classList.remove('dropping-images');

  // Store the current images.
  currentImages = images;
  populateInputImages(images.map(image => {
    return { src: URL.createObjectURL(image.file), name: image.file.name };
  }));

  runFlowButton.disabled = false;
});

// Handle save/save-as/download.
const hasImagesToSave = () => outputImages.length;

saveImagesButton.addEventListener('click', async e => {
  if (!hasImagesToSave()) {
    return;
  }

  // If the input images were cloned, we can't save the new images
  // back to disk. They don't have a handle. Just bail out for now.
  if (currentImages.length !== outputImages.length) {
    return;
  }

  for (const outputImage of outputImages) {
    // Find the handle.
    const handle = await currentImages.find(i => i.file.name === outputImage.name).fsHandlePromise;
    const writable = await handle.createWritable();
    await writable.write(outputImage.blob);
    await writable.close();
  }
});

downloadImagesButton.addEventListener('click', async e => {
  if (!hasImagesToSave()) {
    return;
  }

  for (const image of outputImages) {
    download(image.blob, image.name);
  }
});

// Handle the output-as-input button.
useOutputAsInputButton.addEventListener('click', async e => {
  if (!hasImagesToSave()) {
    return;
  }

  currentImages = outputImages.map(img => {
    return { file: img.blob, name: img.name };
  });
  outputImages = [];

  populateInputImages(currentImages.map(image => {
    return { src: URL.createObjectURL(image.file), name: image.name };
  }));
  populateOutputImages([]);
});

// When the app starts, get the flows and display them in the sidebar.
async function startApp() {
  const flows = await flowsPromise;
  populateFlowList(flows);

  // Also toggle the download/save buttons depending on capabilities.
  if (!('showOpenFilePicker' in window)) {
    saveImagesButton.remove();
  }
}

startApp();
