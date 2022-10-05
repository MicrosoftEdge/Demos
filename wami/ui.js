import { STEPS } from './steps.js';

const flowList = document.querySelector('.flows ul');
const flowEditorName = document.querySelector('.editor .flow-name');
const flowEditorSteps = document.querySelector('.editor .steps');
const inputImages = document.querySelector('.input');
const outputImages = document.querySelector('.output');
const stepChooserDialog = document.querySelector('.step-chooser');
const stepChooserList = stepChooserDialog.querySelector('.steps');
const downloadImagesButton = document.querySelector('.download-images');
const saveImagesButton = document.querySelector('.save-images');
const useOutputAsInputButton = document.querySelector('.use-output-as-input');
const runFlowButton = document.querySelector('.run-flow');
const viewImagesButton = document.querySelector('.view-images');

// Editor UI

export function populateEditor(flow) {
  flowEditorSteps.innerHTML = '';
  flowEditorName.value = flow.name;

  flow.steps.forEach((step, i) => {
    flowEditorSteps.appendChild(createStep(step, i));
  });
}

function createStep(step, index) {
  const li = document.createElement('li');
  li.dataset.type = step.type;
  li.classList.add('step');

  const icon = document.createElement('img');
  icon.classList.add('step-icon');
  icon.height = '40';
  icon.src = `./icons/step-${step.type}.png`;
  li.appendChild(icon);

  const type = document.createElement('h3');
  type.classList.add('step-type');
  type.textContent = STEPS[step.type].name;
  li.appendChild(type);

  const description = document.createElement('p');
  description.classList.add('step-description');
  description.textContent = STEPS[step.type].description;
  li.appendChild(description);

  if (step.params && step.params.length) {
    const params = document.createElement('div');
    params.classList.add('step-params');
    li.appendChild(params);

    for (let i = 0; i < step.params.length; i++) {
      const param = createParam(step.params[i], STEPS[step.type].params[i]);
      params.appendChild(param);
    }
  }

  const removeButton = document.createElement('button');
  removeButton.dataset.index = index;
  removeButton.classList.add('remove-step')
  removeButton.classList.add('delete-icon');
  removeButton.classList.add('no-text');
  removeButton.textContent = 'Remove';
  removeButton.setAttribute('title', 'Remove this step');
  li.appendChild(removeButton);

  return li;
}

export function insertStep(index) {
  stepChooserDialog.showModal();
  // For some reason the dialog's returnValue isn't reset when it's closed.
  // So if the user opens the dialog again after having chosen a value before,
  // even if they ESCape from it, the returnValue will still contain the
  // previous value.
  stepChooserDialog.returnValue = '';

  return new Promise((resolve) => {
    stepChooserDialog.addEventListener('close', (e) => {
      const type = stepChooserDialog.returnValue;
      if (!type) {
        return resolve();
      }

      const params = STEPS[type].params && STEPS[type].params.length ? STEPS[type].params.map((param) => param.default) : null;

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

  // Record the initial scroll position.
  const initialScroll = flowEditorSteps.scrollTop;

  // Mark the step as "moving" so it's taken out of the flow.
  // And give it a real size since it will become absolutely positioned.
  const mouseDelta = mouseDownEvent.clientY - movingStep.offsetTop + flowEditorSteps.scrollTop;
  movingStep.style.top = `${movingStep.offsetTop - flowEditorSteps.scrollTop}px`;
  movingStep.style.left = `${movingStep.offsetLeft}px`;
  movingStep.style.width = `${movingStep.offsetWidth}px`;
  movingStep.classList.add('moving');

  // Create a placeholder with the same height x width.
  // The placeholder is the one that will be moving, creating
  // a visible gap in the list, where the moving step can be dropped.
  const placeholder = document.createElement('li');
  placeholder.classList.add('placeholder');
  placeholder.style.height = `${movingStep.offsetHeight}px`;
  placeholder.style.width = `${movingStep.offsetWidth}px`;
  movingStep.parentNode.insertBefore(placeholder, movingStep);

  const stepElements = [...flowEditorSteps.querySelectorAll('.step')];

  // Restore the initial scroll position, because the DOM changes we just made
  // have caused the scroll position to be reset.
  flowEditorSteps.scrollTop = initialScroll;

  function moveStep(mouseMoveEvent) {
    movingStep.classList.toggle('started-moving', true);
    movingStep.style.top = `${mouseMoveEvent.clientY - mouseDelta}px`;

    // Check the position relative to other steps and move the placeholder.
    for (const otherStep of stepElements) {
      if (otherStep === movingStep) {
        continue;
      }

      if (mouseMoveEvent.clientY > otherStep.offsetTop - flowEditorSteps.scrollTop &&
        mouseMoveEvent.clientY < otherStep.offsetTop - flowEditorSteps.scrollTop + otherStep.offsetHeight / 2) {
        otherStep.parentNode.insertBefore(placeholder, otherStep);
        otherStep.parentNode.insertBefore(movingStep, otherStep);
      } else if (mouseMoveEvent.clientY > otherStep.offsetTop - flowEditorSteps.scrollTop + otherStep.offsetHeight / 2 &&
        mouseMoveEvent.clientY < otherStep.offsetTop - flowEditorSteps.scrollTop + otherStep.offsetHeight) {
        otherStep.parentNode.insertBefore(placeholder, otherStep.nextSibling);
        otherStep.parentNode.insertBefore(movingStep, otherStep.nextSibling);
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

export function populateFlowList(flows, selectId) {
  flowList.innerHTML = '';

  flows.forEach((flow) => {
    flowList.appendChild(createFlowListEntry(flow, selectId));
  });
}

function createFlowListEntry(flow, selectId) {
  const li = document.createElement('li');

  li.classList.add('flow-in-list');
  li.setAttribute('title', 'Open flow');
  if (selectId && flow.id === selectId) {
    li.classList.add('selected');
  }
  li.dataset.id = flow.id;

  const a = document.createElement('a');
  a.href = `#`;
  a.dataset.id = flow.id;
  li.appendChild(a);

  const name = document.createElement('span');
  name.classList.add('flow-name');
  name.textContent = flow.name;
  a.appendChild(name);

  const nbOfSteps = document.createElement('span');
  nbOfSteps.classList.add('flow-nb-of-steps');
  nbOfSteps.textContent =
    `${flow.steps.length} step${flow.steps.length > 1 ? 's' : ''}: ${flow.steps.map((step) => STEPS[step.type].name.toLowerCase()).join(', ')}`;
  a.appendChild(nbOfSteps);

  return li;
}

// Populate the step chooser dialog, right from the start.

function populateStepChooserDialog() {
  for (const key of Object.keys(STEPS)) {
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.setAttribute('value', key);
    button.classList.add('step-to-choose');

    const icon = document.createElement('img');
    icon.src = `./icons/step-${key}.png`;
    icon.width = 40;
    button.appendChild(icon);

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

export function populateInputImages(images) {
  populateImages(images, inputImages);

  runFlowButton.disabled = images.length === 0;
}

export function populateOutputImages(images, supportsFSHandleSave) {
  populateImages(images, outputImages);

  downloadImagesButton.toggleAttribute('disabled', images.length === 0);
  useOutputAsInputButton.toggleAttribute('disabled', images.length === 0);
  saveImagesButton.toggleAttribute('disabled', !supportsFSHandleSave || images.length === 0);
  viewImagesButton.toggleAttribute('disabled', images.length === 0);

  outputImages.parentNode.classList.toggle('has-output-images', images.length > 0);
}

function populateImages(images, container) {
  container.classList.toggle('empty', images.length === 0);

  // Remove all elements from the container except the instructions.
  [...container.children].forEach((child) => {
    if (!child.classList.contains('instructions')) {
      child.remove();
    }
  });

  // Sort the images by name so input and output are in the same order.
  images.sort((a, b) => a.name.localeCompare(b.name));

  for (const { src, name } of images) {
    const div = document.createElement('div');
    div.classList.add('image');

    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumb');
    thumbnail.style.backgroundImage = `url("${src}")`;
    div.appendChild(thumbnail);

    const nameP = document.createElement('p');
    nameP.classList.add('image-name');
    nameP.textContent = name;
    div.appendChild(nameP);

    const sizeP = document.createElement('p');
    sizeP.classList.add('image-size');
    div.appendChild(sizeP);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      sizeP.textContent = `${img.naturalWidth} x ${img.naturalHeight}`;
    }

    container.appendChild(div);
  }
}
