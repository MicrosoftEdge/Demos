import { runFlow } from './flow-runner.js';
import { populateEditor, populateFlowList, populateOutputImages, insertStep, removeStep, populateInputImages } from './ui.js';
import { getFlows, saveFlows } from './store.js';
import { getUniqueId, extractImagesFromDataTransfer, download } from './utils.js';
import { ImageViewer } from './image-viewer.js';

const homeLink = document.querySelector('h1 a');
const welcomePage = document.querySelector('.welcome');
const editorPage = document.querySelector('.editor');
const imagesPage = document.querySelector('.images');
const runFlowButton = document.querySelector('.run-flow');
const addFlowButton = document.querySelector('.add-flow');
const deleteFlowButton = document.querySelector('.delete-flow');
const downloadImagesButton = document.querySelector('.download-images');
const saveImagesButton = document.querySelector('.save-images');
const useOutputAsInputButton = document.querySelector('.use-output-as-input');
const browseImagesButton = document.querySelector('.browse-images');
const randomImagesButton = document.querySelector('.use-random-images');
const removeInputButton = document.querySelector('.remove-input');
const viewImagesButton = document.querySelector('.view-images');
const imageViewerDialog = document.querySelector('.image-viewer');

let flowsPromise = getFlows();
let currentFlow = null;
let currentId = null;
let currentImages = [];
let outputImages = [];
const imageViewer = new ImageViewer(imageViewerDialog);

async function navigateToHome() {
  currentFlow = null;
  currentId = null;

  welcomePage.classList.remove('hidden');
  editorPage.classList.add('hidden');
  imagesPage.classList.add('hidden');

  document.querySelectorAll(`.flow-in-list.selected`).forEach(f => f.classList.remove('selected'));
}

async function navigateToFlow(id) {
  currentId = id;
  const flows = await flowsPromise;
  currentFlow = flows.find(f => id === f.id + '');

  populateFlowList(flows);

  if (!currentFlow) {
    await navigateToHome();
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

// Handle links.
homeLink.addEventListener('click', navigateToHome);
addEventListener('click', async e => {
  const flowLink = e.target.closest('.flow-in-list');
  if (flowLink) {
    await navigateToFlow(flowLink.dataset.id);
  }
});

// Run the current flow.
runFlowButton.addEventListener('click', async e => {
  if (!currentImages.length) {
    return;
  }

  populateOutputImages([]);

  document.documentElement.classList.add('running');
  runFlowButton.disabled = true;

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
  runFlowButton.disabled = false;
});

// Handle flow changes.
addEventListener('change', async e => {
  // One of the inputs changed in the editor. This could be the name of the flow
  // or one of the params for a step.
  if (e.target.closest('.editor')) {
    await handleFlowChange(true);
  }
});

// A step was moved within the flow. Update.
addEventListener('flow-change', handleFlowChange);

/**
 * When a flow was changed (title, steps, order of steps, params, etc.), call
 * this function to save the changes and reload the UI.
 * @param {Boolean} dontUpdateEditor Pass true if you don't need the editor UI part
 * to be reloaded. This is useful when a param was changed for example. This doesn't
 * require to reload the editor since the param is already updated in the input.
 * And reloading the editor would reset the focus.
 */
async function handleFlowChange(dontUpdateEditor) {
  // Something changed in the editor.
  // Save the current flow to the local flows variable, and to the store.
  const stepElements = [...editorPage.querySelectorAll('.step')];
  currentFlow.steps = stepElements.map(stepElement => {
    const type = stepElement.dataset.type;
    const params = [...stepElement.querySelectorAll('.step-param input, .step-param select')].map(i => i.value);
    return { type, params };
  });

  const newName = editorPage.querySelector('.flow-name').value;
  currentFlow.name = newName;

  const flows = await flowsPromise;
  const flowIndex = flows.findIndex(f => f.id === currentFlow.id);
  flows[flowIndex] = currentFlow;

  await saveFlows(flows);

  populateFlowList(flows, currentId);
  if (!dontUpdateEditor) {
    populateEditor(currentFlow);
  }
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

  await navigateToFlow(newFlow.id);
});

// Deleting the current flow.
deleteFlowButton.addEventListener('click', async e => {
  const flows = await flowsPromise;
  const flowIndex = flows.findIndex(f => f.id === currentFlow.id);
  flows.splice(flowIndex, 1);
  await saveFlows(flows);

  populateFlowList(flows);

  await navigateToHome();
});

// Handle drag/drop images in the app.
addEventListener('dragstart', e => {
  // We only handle images being dragged from outside the app.
  // So disable any drag/drop inside the app.
  e.preventDefault();
});

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
});

// Handle browse images button.
browseImagesButton.addEventListener('click', async e => {
  const imagesToStore = [];

  if (!('showOpenFilePicker' in window)) {
    // Browser doesn't support the File System Access API.
    // Use the legacy file input.

    const button = document.createElement('input');
    button.type = 'file';
    button.multiple = true;
    button.accept = 'image/*';
    button.style.display = 'none';

    await new Promise(resolve => {
      button.addEventListener('change', async e => {
        const files = [...e.target.files];

        for (const file of files) {
          imagesToStore.push({
            file,
            fsHandlePromise: Promise.resolve(null)
          });
          resolve();
        }
      }, { once: true });

      button.click();
    });
  } else {
    // Browser supports the File System Access API.
    const handles = await showOpenFilePicker({
      multiple: true,
      types: [
        {
          description: 'Images',
          accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
          }
        }
      ]
    });

    for (const handle of handles) {
      imagesToStore.push({
        file: await handle.getFile(),
        fsHandlePromise: Promise.resolve(handle)
      });
    }
  }

  // Store the current images.
  currentImages = imagesToStore;
  populateInputImages(imagesToStore.map(image => {
    return { src: URL.createObjectURL(image.file), name: image.file.name };
  }));
});

// Handle random image button.
randomImagesButton.addEventListener('click', async e => {
  const nb = Math.ceil(Math.random() * 3) + 2;

  const imagesToStore = [];
  for (let i = 0; i < nb; i++) {
    const w = Math.floor(600 + Math.random() * 800);
    const h = Math.floor(400 + Math.random() * 800);

    const image = await fetch(`https://picsum.photos/${w}/${h}`);
    const blob = await image.blob();
    const file = new File([blob], `random-${i + 1}.jpg`, { type: 'image/jpeg' });

    imagesToStore.push({
      file,
      fsHandlePromise: Promise.resolve(null)
    });
  }

  currentImages = imagesToStore;
  populateInputImages(imagesToStore.map(image => {
    return { src: URL.createObjectURL(image.file), name: image.file.name };
  }));
});

// Handle remove input images button.
removeInputButton.addEventListener('click', async e => {
  currentImages = [];
  populateInputImages([]);

  runFlowButton.disabled = true;
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

// Handle the view images button.
viewImagesButton.addEventListener('click', async e => {
  if (!hasImagesToSave()) {
    return;
  }

  const output = outputImages.sort((a, b) => a.name.localeCompare(b.name)).map(image => {
    return { src: URL.createObjectURL(image.blob), name: image.name };
  });
  const input = currentImages.sort((a, b) => a.file.name.localeCompare(b.file.name)).map(image => {
    return { src: URL.createObjectURL(image.file), name: image.file.name };
  });

  imageViewer.show();

  // 2 modes: either we matching inputs and outputs in which case we can 
  // go into the swipe mode. Or we don't, in which case we just show the
  // output images.
  if (input.length === output.length) {
    imageViewer.populateFromInputAndOutput(input, output);
  } else {
    imageViewer.populateFromOutput(output);
  }
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
