import * as db from "./db.js";

const mainElement = document.querySelector("main");
const listsElement = document.querySelector('.lists');
const tasksElement = document.querySelector('main .tasks');
const newTaskForm = document.querySelector('.new-task-form');
const newTaskInput = document.querySelector('#new-task');
const newListForm = document.querySelector('.new-list-form');
const searchTasksForm = document.querySelector('.search-form');
const searchQueryInput = document.querySelector('#search-query');
const editTaskForm = document.querySelector('.edit-task-form');
const editTaskTitleInput = document.querySelector('#edit-task-title');
const editTaskCompletedInput = document.querySelector('#edit-task-completed');
const editTaskNotesInput = document.querySelector('#edit-task-notes');
const editTaskIdInput = document.querySelector('#edit-task-id');
const editTaskButton = document.querySelector('#edit-task-button');
const closeTaskForm = document.querySelector('#close-edit-task-form');
const editListForm = document.querySelector('.edit-list-form');
const editListTitleInput = document.querySelector('#edit-list-title');
const editListIdInput = document.querySelector('#edit-list-id');
const deleteListButton = document.querySelector('#delete-list-button');
const deleteTaskButton = document.querySelector('#delete-task-button');
const searchResultsDialog = document.querySelector('.search-results');
const searchResultsList = searchResultsDialog.querySelector('.tasks');
const moreListActionsButton = document.querySelector('.more-list-actions');
const moreListActionsDialog = document.querySelector('.more-list-actions-dialog');
const moreListActionsForm = moreListActionsDialog.querySelector('form');

const LIST_COLORS = [...moreListActionsDialog.querySelectorAll('.list-colors input')].map(input => input.value);

function getRandomListColor() {
  return LIST_COLORS[Math.floor(Math.random() * LIST_COLORS.length)];
}

function createListItem(id, title, color, nbTasks) {
  const listItem = document.createElement('li');
  listItem.classList.add('list');
  listItem.dataset.id = id;
  listItem.dataset.color = color;
  listItem.style.setProperty('--list-color', color);

  const listLink = document.createElement('a');
  listLink.href = 'load-tasks';
  listLink.innerText = title;
  listItem.appendChild(listLink);

  const numberOfTasks = document.createElement('span');
  numberOfTasks.classList.add('number-of-tasks');
  numberOfTasks.innerText = nbTasks;
  listItem.appendChild(numberOfTasks);

  listLink.addEventListener('click', e => {
    e.preventDefault();
    selectList(listItem);
  });

  return listItem;
}

function createTaskItem(id, title, completed, notes, readOnly) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task');
  taskItem.dataset.id = id;

  if (notes) {
    taskItem.classList.add('has-notes');
  }

  if (completed) {
    taskItem.classList.add('is-completed');
  }

  const completedBox = document.createElement('input');
  completedBox.type = 'checkbox';
  completedBox.checked = !!completed;
  if (readOnly) {
    completedBox.disabled = true;
  } else {
    completedBox.addEventListener('change', () => {
      db.completeTask(id, completedBox.checked);
      taskItem.classList.toggle('is-completed');
    });
  }
  taskItem.appendChild(completedBox);

  const titleEl = document.createElement('span');
  titleEl.classList.add('title');
  titleEl.innerText = title;
  taskItem.appendChild(titleEl);

  if (!readOnly) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit task';
    editButton.title = 'Edit task';
    editButton.classList.add('edit-button', 'no-label');
    editButton.addEventListener('click', () => {
      document.querySelectorAll('.task').forEach(task => task.classList.remove('selected'));
      taskItem.classList.add('selected');

      fillEditTaskForm(id, title, notes, completedBox.checked);
    });
    taskItem.appendChild(editButton);
  }

  return taskItem;
}

async function fillEditTaskForm(id, title, notes, completed) {
  editTaskTitleInput.value = title;
  editTaskNotesInput.value = notes;
  editTaskCompletedInput.checked = completed;
  editTaskIdInput.value = id;
  editTaskButton.disabled = false;
  deleteTaskButton.disabled = false;

  document.documentElement.classList.add('is-editing');
}

function clearEditTaskForm() {
  editTaskTitleInput.value = '';
  editTaskNotesInput.value = '';
  editTaskCompletedInput.checked = false;
  editTaskIdInput.value = '';
  editTaskButton.disabled = true;
  deleteTaskButton.disabled = true;

  document.documentElement.classList.remove('is-editing');
}

async function selectList(listItem, highlightedTaskId) {
  document.querySelectorAll('.task').forEach(task => task.classList.remove('selected'));
  clearEditTaskForm();

  document.querySelectorAll('.list').forEach(list => list.classList.remove('selected'));
  listItem.classList.add('selected');
  const listId = listItem.dataset.id;

  mainElement.style.backgroundColor = listItem.dataset.color;

  editListTitleInput.value = listItem.querySelector('a').innerText;
  editListIdInput.value = listId;

  tasksElement.innerHTML = '';

  let scrollTo = null;
  const tasks = await db.getListTasks(listId);
  tasks.forEach(task => {
    const taskItem = createTaskItem(task.id, task.title, task.completed, task.notes);
    if (task.id === highlightedTaskId) {
      taskItem.classList.add('highlighted');
      setTimeout(() => taskItem.classList.remove('highlighted'), 2000);
      scrollTo = taskItem;
    }
    tasksElement.appendChild(taskItem);
  });

  if (scrollTo) {
    scrollTo.scrollIntoView();
  }
}

newTaskForm.onsubmit = async function (event) {
  event.preventDefault();

  const selectedList = document.querySelector('.list.selected');
  const title = newTaskInput.value;
  const listId = selectedList.dataset.id;

  await db.createTask(title, listId);

  event.target.reset();

  // FIXME: instead of refreshing the list, just add the new task.
  await selectList(selectedList);

  selectedList.querySelector('.number-of-tasks').innerText = tasksElement.querySelectorAll('.task').length;
}

newListForm.onsubmit = async function (event) {
  event.preventDefault();

  const [newList] = await db.createList('Untitled list', getRandomListColor());
  const listItem = createListItem(newList.id, newList.title, newList.color, 0);
  document.querySelector('.lists').appendChild(listItem);
  selectList(listItem);
}

searchTasksForm.onsubmit = async function (event) {
  event.preventDefault();

  const query = searchQueryInput.value;
  const tasks = await db.searchTasks(query);

  searchResultsList.innerHTML = '';

  for (const task of tasks) {
    const li = createTaskItem(task.id, task.title, task.completed, task.notes, true);
    
    const listTitle = document.createElement('a');
    listTitle.href = 'go-to-list';
    listTitle.classList.add('list-title');
    listTitle.innerText = task.list_title;
    listTitle.style.backgroundColor = task.list_color;
    li.appendChild(listTitle);

    listTitle.addEventListener('click', e => {
      e.preventDefault();

      const listItem = document.querySelector(`.list[data-id="${task.list_id}"]`);
      selectList(listItem, task.id);

      searchResultsDialog.close();
    });

    searchResultsList.appendChild(li);
  }

  searchResultsDialog.showModal();
}

editTaskForm.onsubmit = async function (event) {
  event.preventDefault();

  const id = editTaskIdInput.value;
  const title = editTaskTitleInput.value;
  const completed = editTaskCompletedInput.checked;
  const notes = editTaskNotesInput.value;

  await db.addTaskNotes(id, notes);
  await db.renameTask(id, title);
  await db.completeTask(id, completed);

  // FIXME: instead of refreshing the list, just update the task.
  const selectedList = document.querySelector('.list.selected');
  await selectList(selectedList);
}

editListForm.onsubmit = async function (event) {
  event.preventDefault();

  const id = editListIdInput.value;
  const title = editListTitleInput.value;

  await db.renameList(id, title);
  document.querySelector('.list.selected a').innerText = title;
}

deleteListButton.addEventListener('click', async () => {
  const id = editListIdInput.value;
  await db.deleteList(id);

  await reInitUI();
});

deleteTaskButton.addEventListener('click', async () => {
  const id = editTaskIdInput.value;
  const taskItem = document.querySelector(`.task[data-id="${id}"]`);

  await db.deleteTask(id);
  taskItem.remove();

  const selectedList = document.querySelector('.list.selected');
  selectedList.querySelector('.number-of-tasks').innerText = tasksElement.querySelectorAll('.task').length;

  clearEditTaskForm();
});

closeTaskForm.addEventListener('click', () => {
  document.documentElement.classList.remove('is-editing');
});

addEventListener('mousedown', event => {
  if (document.documentElement.classList.contains('is-editing') &&
    !event.target.closest('.edit-task-form')) {
    document.documentElement.classList.remove('is-editing');
  }
});

moreListActionsButton.addEventListener('click', () => {
  if (moreListActionsDialog.open) {
    moreListActionsDialog.close();
  } else {
    moreListActionsDialog.showModal();
  }
});

moreListActionsForm.addEventListener('change', async () => {
  const id = editListIdInput.value;
  const color = moreListActionsForm['list-color'].value;

  await db.changeListColor(id, color);
  
  const selectedList = document.querySelector('.list.selected');
  selectedList.style.setProperty('--list-color', color);
  mainElement.style.backgroundColor = color;

  moreListActionsDialog.close();
});

async function reInitUI() {
  listsElement.innerHTML = '';
  tasksElement.innerHTML = '';

  const lists = await db.getLists();
  lists.forEach(list => {
    const listItem = createListItem(list.id, list.title, list.color, list.nb_tasks);
    listsElement.appendChild(listItem);
  });

  // Select the first list.
  if (lists.length) {
    selectList(listsElement.querySelector('.list'));
  }
}

async function startApp() {
  try {
    await db.initDB();
  } catch (error) {
    console.error(`Error initializing database`, error);
    // Reload the page.
    // window.location.reload();
    return;
  }

  await reInitUI();
}

startApp();
