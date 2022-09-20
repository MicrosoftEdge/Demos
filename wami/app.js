import { runFlow } from './flow-runner.js';
import { populateEditor, populateFlowList, populateOutputImages, insertStep, removeStep } from './ui.js';
import { getFlows, saveFlows } from './store.js';
import { getUniqueId } from './utils.js';

const welcomePage = document.querySelector('.welcome');
const editorPage = document.querySelector('.editor');
const closeFlowButton = editorPage.querySelector('.close-flow');
const runFlowButton = editorPage.querySelector('.run-flow');
const addFlowButton = document.querySelector('.add-flow');
const deleteFlowButton = document.querySelector('.delete-flow');

let flowsPromise = getFlows();
let currentFlow = null;
let currentId = null;

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
      }
    });
  } else if (url.pathname.startsWith('/wami/flow/')) {
    navigateEvent.intercept({
      async handler() {
        const id = url.pathname.substring('/wami/flow/'.length);
        currentId = id;
        const flows = await flowsPromise;
        currentFlow = flows.find(f => id === f.id + '');

        welcomePage.classList.add('hidden');
        editorPage.classList.remove('hidden');

        if (!currentFlow) {
          await navigation.navigate('/wami/');
          return;
        }

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
  document.documentElement.classList.add('running');

  const processedFiles = await runFlow(currentFlow);
  if (processedFiles) {
    const imageSources = processedFiles.outputFiles.map(file => {
      return URL.createObjectURL(file.blob);
    });
    populateOutputImages(imageSources);
  }

  document.documentElement.classList.remove('running');
});

// Navigate back to the home page when the current flow is closed.
closeFlowButton.addEventListener('click', e => {
  navigation.navigate('/wami/');
});

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

// When the app starts, get the flows and display them in the sidebar.
async function startApp() {
  const flows = await flowsPromise;
  populateFlowList(flows);
}

startApp();
