const form = document.querySelector('form');
const list = document.querySelector('#tasks');
const task = document.querySelector('#new-task');

const STORAGE_KEY = 'mytasks';

function sortTasksByDate(tasks) {
  return tasks.sort((a, b) => {
    return b.date - a.date;
  });
}

const updateList = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );

  let todo = [];
  let done = [];
  for (t of Object.keys(tasks)) {
    if (tasks[t].status === 'done') {
      done.push({
        text: t,
        done: true,
        date: tasks[t].date
      });
    } else {
      todo.push({
        text: t,
        done: true,
        date: tasks[t].date
      });
    }
  }
  // Sort the 2 lists by date.
  todo = sortTasksByDate(todo);
  done = sortTasksByDate(done);

  let out = '';
  for (const item of todo) {
    out += `
    <li class="task">
      <label title="Complete task">
        <input type="checkbox" 
        value="${item.text}" class="box">
        <span class="text">${item.text}</span>
      </label>
      <button type="button" data-task="${item.text}" class="delete" title="Delete task">╳</button>
    </li>`;
  }
  for (const item of done) {
    out += `
    <li class="task completed">
      <label title="Reopen task">
        <input type="checkbox" 
        checked
        value="${item.text}" class="box">
        <span class="text">${item.text}</span>
      </label>
      <button type="button" data-task="${item.text}" class="delete" title="Delete task">╳</button>
    </li>`;
  }

  list.innerHTML = out;
};

const addTask = e => {
  if (task.value) {
    let t = task.value.replace(/[^A-Z|0-9| ]+/ig, '');
    if (t.value !== t) {
      console.warn('Cleaned up task value');
      t.value = t;
    }
    if (!tasks[t]) {
      console.info('Adding Task: ' + t);
      tasks[t] = { status: 'active', date: Date.now() };
      updateList();
      task.value = '';
    } else {
      console.warn('Task already exists');
    }
  }
  e.preventDefault();

  task.focus();
};

const changeTask = e => {
  let t = e.target;
  if (t.dataset.task) {
    delete tasks[t.dataset.task];
    console.info(`Removed: ${t.dataset.task}`);
    updateList();
    e.preventDefault();
  }
  if (t.nodeName.toLowerCase() === 'input') {
    tasks[t.value].status = t.checked ? 'done' : 'active';
    tasks[t.value].date = Date.now();
    console.info(t.value + ': ' + tasks[t.value].status)
    updateList();
    e.preventDefault();
  }
}

let tasks = localStorage.getItem(STORAGE_KEY) ?
  JSON.parse(localStorage.getItem(STORAGE_KEY)) : {};

// Backward compat with old data structure.
if (tasks.length && !tasks[0].status) {
  tasks = {};
}

updateList(tasks)

list.addEventListener('click', changeTask);
form.addEventListener('submit', addTask);
