const form = document.querySelector('form');
const list = document.querySelector('#tasks');
const task = document.querySelector('#task');

const updateList = () => {
  window.localStorage.setItem(
    'mytasks', 
    JSON.stringify(tasks)
  );
  let out = '';
  for(t of Object.keys(tasks)) {
    out += `
    <li>
      <label>
        <input type="checkbox" 
        ${tasks[t] === 'done' ? 'checked' : ''}
        value="${t}"><span>${t}</span>
        <button type="button" data-task="${t}">ｘ</button>
        </label>
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
      console.info('Adding Task :' + t);
      tasks[t] = 'active';
      updateList();
      task.value = '';
    } else {
      console.warn('Task already exists');
    }
  }
  e.preventDefault();
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
    tasks[t.value] = t.checked ? 'done' : 'active';
    console.info(t.value + ': '+ tasks[t.value])
    updateList();
    e.preventDefault();
  }      
}

let tasks = window.localStorage.getItem('mytasks') ?
JSON.parse(window.localStorage.getItem('mytasks')) : {} ;
updateList(tasks)

list.addEventListener('click', changeTask);
form.addEventListener('submit', addTask);
