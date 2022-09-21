import { STEPS } from './steps.js';

const flowList = document.querySelector('.flows ul');
const flowEditorName = document.querySelector('.editor .flow-name');
const flowEditorSteps = document.querySelector('.editor .steps');
const inputImages = document.querySelector('.input-images');
const outputImages = document.querySelector('.output-images');
const stepChooserDialog = document.querySelector('.step-chooser');
const stepChooserList = stepChooserDialog.querySelector('.steps');

// Editor UI

export function populateEditor(flow) {
  flowEditorSteps.innerHTML = '';
  flowEditorName.value = flow.name;

  populateOutputImages([]);

  flowEditorSteps.appendChild(createAddStepButton(0));
  flow.steps.forEach((step, i) => {
    flowEditorSteps.appendChild(createStep(step, i));
    flowEditorSteps.appendChild(createAddStepButton(i + 1));
  });
}

function createStep(step, index) {
  const li = document.createElement('li');
  li.dataset.type = step.type;
  li.classList.add('step');

  const type = document.createElement('h3');
  type.classList.add('step-type');
  type.textContent = STEPS[step.type].name;
  li.appendChild(type);

  const description = document.createElement('p');
  description.classList.add('step-description');
  description.textContent = STEPS[step.type].description;
  li.appendChild(description);

  const params = document.createElement('div');
  params.classList.add('step-params');
  li.appendChild(params);

  for (let i = 0; i < step.params.length; i++) {
    const param = createParam(step.params[i], STEPS[step.type].params[i]);
    params.appendChild(param);
  }

  const removeButton = document.createElement('button');
  removeButton.dataset.index = index;
  removeButton.classList.add('remove-step')
  removeButton.classList.add('delete-icon');
  removeButton.textContent = 'Remove step';
  removeButton.setAttribute('title', 'Remove this step');
  li.appendChild(removeButton);

  return li;
}

function createAddStepButton(index) {
  const li = document.createElement('li');
  li.dataset.index = index;
  li.classList.add('add-step');

  const button = document.createElement('button');
  button.classList.add('add-icon');
  button.textContent = 'Add step';
  button.setAttribute('title', 'Add a step');
  li.appendChild(button);

  return li;
}

export function insertStep(index) {
  stepChooserDialog.showModal();

  return new Promise((resolve) => {
    stepChooserDialog.addEventListener('close', (e) => {
      const type = stepChooserDialog.returnValue;
      const params = STEPS[type].params.map((param) => param.default);

      const li = createStep({ type, params });
  
      flowEditorSteps.insertBefore(li, flowEditorSteps.querySelectorAll('.step')[index]);

      resolve();
    }, { once: true });
  });
}

export function removeStep(index) {
  flowEditorSteps.querySelectorAll('.step')[index].remove();
}

function createParam(param, paramDefinition) {
  const paramEl = document.createElement('p');
  paramEl.classList.add('step-param');

  const paramName = document.createElement('label');
  paramName.textContent = paramDefinition.name;
  paramEl.appendChild(paramName);

  let paramInput = null;
  if (paramDefinition.type === 'select') {
    paramInput = document.createElement('select');
    paramDefinition.options.forEach((option) => {
      const optionEl = document.createElement('option');
      optionEl.value = option;
      optionEl.textContent = option;
      paramInput.appendChild(optionEl);

      if (option === param) {
        optionEl.selected = true;
      }
    });
  } else {
    paramInput = document.createElement('input');
    paramInput.type = paramDefinition.type;
    paramInput.value = param;
  }

  paramName.appendChild(paramInput);

  return paramEl;
}

addEventListener('mousedown', mouseDownEvent => {
  const movingStep = mouseDownEvent.target.closest('.editor .step');
  const isInParam = mouseDownEvent.target.closest('.step-param');
  const isInButton = mouseDownEvent.target.closest('.step .remove-step');
  const onlyOneStep = flowEditorSteps.querySelectorAll('.step').length === 1;

  if (!movingStep || isInParam || isInButton || onlyOneStep) {
    return;
  }

  // Mark the step as "moving" so it's taken out of the flow.
  const mouseDelta = mouseDownEvent.clientY - movingStep.offsetTop;
  movingStep.style.top = `${movingStep.offsetTop}px`;
  movingStep.style.left = `${movingStep.offsetLeft}px`;
  movingStep.style.width = `${movingStep.offsetWidth}px`;
  movingStep.classList.add('moving');

  // Create a placeholder with the same heightxwidth.
  const placeholder = document.createElement('li');
  placeholder.classList.add('placeholder');
  placeholder.style.height = `${movingStep.offsetHeight}px`;
  placeholder.style.width = `${movingStep.offsetWidth}px`;
  movingStep.parentNode.insertBefore(placeholder, movingStep);

  const stepElements = [...flowEditorSteps.querySelectorAll('.step')];

  function moveStep(mouseMoveEvent) {
    movingStep.classList.toggle('started-moving', true);
    movingStep.style.top = `${mouseMoveEvent.clientY - mouseDelta}px`;

    // Check the position relative to other steps and move the placeholder.
    for (const otherStep of stepElements) {
      if (otherStep === movingStep) {
        continue;
      }

      if (mouseMoveEvent.clientY > otherStep.offsetTop &&
        mouseMoveEvent.clientY < otherStep.offsetTop + otherStep.offsetHeight / 2) {
        otherStep.parentNode.insertBefore(placeholder, otherStep.previousSibling);
        otherStep.parentNode.insertBefore(movingStep, otherStep.previousSibling);
      } else if (mouseMoveEvent.clientY > otherStep.offsetTop + otherStep.offsetHeight / 2 &&
        mouseMoveEvent.clientY < otherStep.offsetTop + otherStep.offsetHeight) {
        otherStep.parentNode.insertBefore(placeholder, otherStep.nextSibling.nextSibling);
        otherStep.parentNode.insertBefore(movingStep, otherStep.nextSibling.nextSibling);
      }
    }
  }

  addEventListener('mousemove', moveStep);
  addEventListener('mouseup', () => {
    movingStep.classList.remove('moving');
    movingStep.classList.remove('started-moving');
    removeEventListener('mousemove', moveStep);

    placeholder.remove();

    // Let the app know that something changed by firing a flow-change event.
    dispatchEvent(new Event('flow-change'));
  }, { once: true });
});

// List of flows

export function populateFlowList(flows) {
  flowList.innerHTML = '';

  flows.forEach((flow) => {
    flowList.appendChild(createFlowListEntry(flow));
  });
}

function createFlowListEntry(flow) {
  const li = document.createElement('li');

  li.classList.add('flow-in-list');
  li.setAttribute('title', 'Open flow');

  const a = document.createElement('a');
  a.href = `/wami/flow/${flow.id}`;
  a.textContent = flow.name;
  li.appendChild(a);

  return li;
}

// Populate the step chooser dialog, right from the start.

function populateStepChooserDialog() {
  for (const key of Object.keys(STEPS)) {
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.setAttribute('value', key);
    button.classList.add('step-to-choose');

    const type = document.createElement('h3');
    type.classList.add('step-type');
    type.textContent = STEPS[key].name;
    button.appendChild(type);

    const description = document.createElement('p');
    description.classList.add('step-description');
    description.textContent = STEPS[key].description;
    button.appendChild(description);

    stepChooserList.appendChild(button);
  }
}

populateStepChooserDialog();

// List of images.

export function populateInputImages(imageSources) {
  populateImages(imageSources, inputImages);
}

export function populateOutputImages(imageSources) {
  populateImages(imageSources, outputImages);
}

function populateImages(imageSources, container) {
  container.innerHTML = '';

  for (const src of imageSources) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = src;
    li.appendChild(img);
    container.appendChild(li);
  }
}
