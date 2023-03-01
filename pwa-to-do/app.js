import * as db from "./db.js";
import { setFileForTask, getFileForTask, deleteFileForTask } from "./files.js";
import { convertDateTimeToEpoch, convertEpochToDateTime } from "./utils.js";

const mainElement = document.querySelector("main");
const listsElement = document.querySelector('.lists');
const autoListsElement = document.querySelector('.auto-lists');
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
const editTaskFileInput = document.querySelector('#edit-task-file');
const editTaskDueByInput = document.querySelector('#edit-task-dueby');
const editTaskIdInput = document.querySelector('#edit-task-id');
const editTaskButton = document.querySelector('#edit-task-button');
const editTaskUploadSection = editTaskForm.querySelector('.upload');
const editTaskDownloadSection = editTaskForm.querySelector('.download');
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
const taskFileDownloadLink = document.querySelector('#task-file-download');
const taskFileDeleteButton = document.querySelector('#delete-task-file-button');
const learnMoreLink = document.querySelector('h1 a');
const learnMoreDialog = document.querySelector('.learn-more-dialog');
const exportDBButton = document.querySelector('#db-export-button');
// const importDBInput = document.querySelector('#db-import-file');
const persistDBButton = document.querySelector('#make-db-persistent');

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

function createTaskItem(id, title, completed, notes, hasFile, dueBy, readOnly) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task');
  taskItem.dataset.id = id;

  if (notes) {
    taskItem.classList.add('has-notes');
  }

  if (completed) {
    taskItem.classList.add('is-completed');
  }

  if (hasFile) {
    taskItem.classList.add('has-file');
  }

  if (dueBy) {
    taskItem.classList.add('has-due-date');
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

      updateAutoListsCount();
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

      fillEditTaskForm(id, title, notes, hasFile, completedBox.checked, dueBy);
    });
    taskItem.appendChild(editButton);
  }

  return taskItem;
}

function fillEditTaskForm(id, title, notes, hasFile, completed, dueBy) {
  editTaskTitleInput.value = title;
  editTaskNotesInput.value = notes;
  editTaskFileInput.value = '';
  editTaskDueByInput.value = convertEpochToDateTime(dueBy);
  editTaskCompletedInput.checked = completed;
  editTaskIdInput.value = id;
  editTaskButton.disabled = false;
  deleteTaskButton.disabled = false;

  if (hasFile) {
    editTaskUploadSection.style.display = 'none';
    editTaskDownloadSection.style.display = 'block';

    getFileForTask(id).then(file => {
      taskFileDownloadLink.href = URL.createObjectURL(file);
      taskFileDownloadLink.download = file.name;
      taskFileDownloadLink.innerText = file.name;
    });
  } else {
    editTaskUploadSection.style.display = 'block';
    editTaskDownloadSection.style.display = 'none';
  }

  document.documentElement.classList.add('is-editing');
}

function clearEditTaskForm() {
  editTaskTitleInput.value = '';
  editTaskNotesInput.value = '';
  editTaskFileInput.value = '';
  editTaskDueByInput.value = '';
  editTaskCompletedInput.checked = false;
  editTaskIdInput.value = '';
  editTaskButton.disabled = true;
  deleteTaskButton.disabled = true;

  editTaskUploadSection.style.display = 'none';
  editTaskDownloadSection.style.display = 'none';

  document.documentElement.classList.remove('is-editing');
}

async function getListTasks(listId) {
  switch (listId) {
    case 'overdue':
      return await db.getOverdueTasks();
    case 'today':
      return await db.getTodaysTasks();
    default:
      return await db.getListTasks(listId);
  }
}

function isListEditable(listId) {
  return listId !== 'overdue' && listId !== 'today';
}

async function selectList(listItem, highlightedTaskId) {
  moreListActionsButton.style.display = isListEditable(listItem.dataset.id) ? 'block' : 'none';
  editListTitleInput.disabled = !isListEditable(listItem.dataset.id);
  newTaskForm.style.display = isListEditable(listItem.dataset.id) ? 'flex' : 'none';

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
  const tasks = await getListTasks(listId);

  tasks.forEach(task => {
    const taskItem = createTaskItem(task.id, task.title, task.completed, task.notes, task.has_file, task.due_by);
    if (task.id === highlightedTaskId) {
      taskItem.classList.add('highlighted');
      setTimeout(() => taskItem.classList.remove('highlighted'), 2000);
      scrollTo = taskItem;
    }
    tasksElement.appendChild(taskItem);

    if (task.has_file) {
      const fileLink = document.createElement('a');
      fileLink.classList.add('file-link');
    }
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
    const li = createTaskItem(task.id, task.title, task.completed, task.notes, task.has_file, true);

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
  const dueBy = convertDateTimeToEpoch(editTaskDueByInput.value);

  // Get the file from the input.
  const file = editTaskFileInput.files[0];
  if (file) {
    await setFileForTask(id, file);
    await db.setTaskHasFile(id, !!file);
  }

  await db.addTaskNotes(id, notes);
  await db.renameTask(id, title);
  await db.completeTask(id, completed);
  await db.setTaskDueBy(id, dueBy);

  // FIXME: instead of refreshing the list, just update the task.
  const selectedList = document.querySelector('.list.selected');
  await selectList(selectedList);

  // Also update the auto-lists' counts.
  updateAutoListsCount();
}

async function updateAutoListsCount() {
  const overdueCount = (await db.getOverdueTasks()).length;
  document.querySelector('.list[data-id="overdue"] .number-of-tasks').innerText = overdueCount;
  const todayCount = (await db.getTodaysTasks()).length;
  document.querySelector('.list[data-id="today"] .number-of-tasks').innerText = todayCount;

  await updateAppBadge();
}

async function updateAppBadge() {
  const todayCount = (await db.getTodaysTasks()).length;

  if (navigator.setAppBadge) {
    if (todayCount > 0) {
      navigator.setAppBadge(todayCount);
    } else {
      navigator.clearAppBadge();
    }
  }
}

setInterval(updateAutoListsCount, 1000 * 60 * 5);

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
  await deleteFileForTask(id);
  taskItem.remove();

  const selectedList = document.querySelector('.list.selected');
  selectedList.querySelector('.number-of-tasks').innerText = tasksElement.querySelectorAll('.task').length;

  clearEditTaskForm();
});

taskFileDeleteButton.addEventListener('click', async () => {
  const id = editTaskIdInput.value;
  await deleteFileForTask(id);
  await db.setTaskHasFile(id, false);

  clearEditTaskForm();
  document.documentElement.classList.remove('is-editing');
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
  mainElement.style.accentColor = color;

  moreListActionsDialog.close();
});

learnMoreLink.addEventListener('click', e => {
  e.preventDefault();

  learnMoreDialog.showModal();
});

persistDBButton.addEventListener('click', async () => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      try {
        await navigator.storage.persist();
        persistDBButton.textContent = "Database is now persistent";
      } catch (e) {
        persistDBButton.textContent = "Database could not be persisted";
      }
    } else {
      persistDBButton.textContent = "Database was already persisted";
    }
  }
});

exportDBButton.addEventListener('click', async () => {
  const data = await db.getDBFile();
  const blob = new Blob([data], { type: 'application/x-sqlite3' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  a.download = `pwa-to-do-${date}.db`;
  a.href = url;
  a.click();
});

// TODO
// importDBInput.addEventListener('change', e => {
//   const file = e.target.files[0];
//   if (!file) {
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = async () => {
//     const data = reader.result;
//     await db.importDBFile(data);
//     await startApp();
//   };

//   reader.readAsArrayBuffer(file);
// });

async function reInitUI() {
  listsElement.innerHTML = '';
  autoListsElement.innerHTML = '';
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

  await initAutoLists();
}

async function initAutoLists() {
  // Overdue tasks.
  const overdueTasks = await db.getOverdueTasks();
  const overdueListItem = createListItem('overdue', 'Overdue', 'coral', overdueTasks.length);
  autoListsElement.appendChild(overdueListItem);

  // Due today.
  const dueTodayTasks = await db.getTodaysTasks();
  const dueTodayListItem = createListItem('today', 'Today', 'gainsboro', dueTodayTasks.length);
  autoListsElement.appendChild(dueTodayListItem);
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
  await updateAppBadge();
}

startApp();
