const form = document.querySelector('form');
const list = document.querySelector('#tasks');
const task = document.querySelector('#new-task');

const STORAGE_KEY = 'demo-to-do-tasks';

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

  for (const id in tasks) {
    if (tasks[id].status === 'done') {
      done.push({
        text: tasks[id].text,
        date: tasks[id].date,
        id
      });
    } else {
      todo.push({
        text: tasks[id].text,
        date: tasks[id].date,
        id
      });
    }
  }

  // Sort the 2 lists by dates.
  todo = sortTasksByDate(todo);
  done = sortTasksByDate(done);

  let out = '';

  if (todo.length) {
    out += '<li class="divider">To do</li>';
    for (const item of todo) {
      out += `
      <li class="task">
        <label title="Complete task">
          <input type="checkbox" 
          value="${item.id}" class="box"
          title="Complete task">
          <span class="text">${item.text}</span>
        </label>
        <button type="button" data-task="${item.id}" class="delete" title="Delete task">╳</button>
      </li>`;
    }
  } else {
    out += '<li class="divider">No tasks defined</li>';
  }

  if (done.length) {
    out += '<li class="divider">Completed</li>';
    for (const item of done) {
      out += `
      <li class="task completed">
        <label title="Reopen task">
          <input type="checkbox" 
          checked
          value="${item.id}" class="box"
          title="Reopen task">
          <span class="text">${item.text}</span>
        </label>
        <button type="button" data-task="${item.id}" class="delete" title="Delete task">╳</button>
      </li>`;
    }
  }

  list.innerHTML = out;
};

const escapeHTML = str => {
  var p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

const uniqueID = () => {
  return Math.random().toString(36).substr(2, 9);
}

const addTask = e => {
  if (task.value) {
    const text = escapeHTML(task.value);
    const id = uniqueID();

    if (!tasks[id]) {
      console.info(`Adding task ${id}: ${text}`);
      tasks[id] = { status: 'active', date: Date.now(), text: text };
      updateList();
      task.value = '';
    } else {
      console.warn(`Task ID ${id} already exists`);
    }
  }
  e.preventDefault();

  task.focus();
};

const changeTask = e => {
  let t = e.target;

  // Deleting a task.
  if (t.dataset.task) {
    console.info(`Removing tasks: ${t.dataset.task}`);

    delete tasks[t.dataset.task];
    updateList();
    e.preventDefault();
  }

  // Change a task's state.
  if (t.nodeName.toLowerCase() === 'input') {
    console.log(`Marking task ${t.value} as ${t.checked ? 'done' : 'active'}`);

    tasks[t.value].status = t.checked ? 'done' : 'active';
    tasks[t.value].date = Date.now();
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
