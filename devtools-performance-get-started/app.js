const INITIAL_NB_ELEMENTS = 10;
const INCREMENT = 10;
const SPEED = 3;

const canvas = document.querySelector('.canvas');
const moreButton = document.querySelector('.more');
const lessButton = document.querySelector('.less');
const stopButton = document.querySelector('.stop');
const optimizedButton = document.querySelector('input[value="optimized"]');
const slowButton = document.querySelector('input[value="slow"]');

let nbOfElements = INITIAL_NB_ELEMENTS;
let isOptimized = false;
let isRunning = true;
let currentElements = [];
let canvasHeight = canvas.offsetHeight;

stopButton.addEventListener('click', () => {
  isRunning = !isRunning;
  stopButton.textContent = isRunning ? 'Stop' : 'Start';

  if (isRunning) {
    update();
  }
});

moreButton.addEventListener('click', () => {
  nbOfElements += INCREMENT;
  init();
});

lessButton.addEventListener('click', () => {
  nbOfElements -= INCREMENT;
  if (nbOfElements < INITIAL_NB_ELEMENTS) {
    nbOfElements = INITIAL_NB_ELEMENTS;
  }

  init();
});

optimizedButton.addEventListener('click', () => {
  isOptimized = true;
  init();
});

slowButton.addEventListener('click', () => {
  isOptimized = false;
  init();
});

function updateOptimized() {
  for (let i = 0; i < currentElements.length; i++) {
    const element = currentElements[i];

    // Initialize the position of the element if it hasn't been done yet.
    if (!element.style.transform) {
      element.style.transform = `translateY(${Math.random() * 100}vh)`;
    }

    // Read the current position.
    const currentPos = parseFloat(element.style.transform.match(/[0-9.]+/)[0]);
    // Read the direction.
    const direction = element.dataset.dir;
    // Calculate the next position.
    let nextPos = direction === 'up' ? currentPos - (SPEED * 100 / canvasHeight) : currentPos + (SPEED * 100 / canvasHeight);
    // If the new position is out of bounds, reset it, and switch the direction.
    if (nextPos < 0) {
      nextPos = 0;
      element.dataset.dir = 'down';
    } else if (nextPos > 100) {
      nextPos = 100;
      element.dataset.dir = 'up';
    }

    // Set the new position on the element.
    element.style.transform = `translateY(${nextPos}vh)`;
  }
}

function updateSlow() {
  for (let i = 0; i < currentElements.length; i++) {
    const element = currentElements[i];

    // Initialize the position of the element if it hasn't been done yet.
    if (!element.style.top) {
      element.style.top = `${Math.random() * 100}%`;
    }

    // Read the current position.
    const currentPos = element.offsetTop;
    // Read the direction.
    const direction = element.dataset.dir;
    // Calculate the next position.
    let nextPos = direction === 'up' ? currentPos - SPEED : currentPos + SPEED;
    // If the new position is out of bounds, reset it.
    if (nextPos < 0) {
      nextPos = 0;
    } else if (nextPos > canvas.offsetHeight) {
      nextPos = canvas.offsetHeight;
    }
    // Set the new position on the element.
    element.style.top = `${nextPos}px`;
    // Switch the direction if needed.
    if (element.offsetTop === 0) {
      element.dataset.dir = 'down';
    } else if (element.offsetTop === canvas.offsetHeight) {
      element.dataset.dir = 'up';
    }
  }
}

let rAF = null;

function update() {
  if (!isRunning) {
    return;
  }

  if (isOptimized) {
    updateOptimized();
  } else {
    updateSlow();
  }

  rAF = requestAnimationFrame(update);
}

function init() {
  canvas.innerHTML = '';
  currentElements = [];
  cancelAnimationFrame(rAF);
  canvasHeight = canvas.offsetHeight;

  for (let i = 0; i < nbOfElements; i++) {
    const element = document.createElement('div');
    element.classList.add('element');
    element.style.left = `${i / (nbOfElements / 100)}%`;
    element.setAttribute('data-dir', Math.random() > 0.5 ? 'up' : 'down');

    canvas.appendChild(element);
    currentElements.push(element);
  }

  update();
}

onload = init;
