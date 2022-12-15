const DB_FILE_NAME = 'pwa-to-do/db-v5';
const DEFAULT_LIST_NAME = 'Things to do'
const DEFAULT_LIST_COLOR = 'peachpuff';
const SQL_NEW_TABLES = `
  CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, notes TEXT, has_file INTEGER NOT NULL DEFAULT 0, due_by INTEGER, list_id INTEGER);
  CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY, title TEXT, color TEXT);
  INSERT INTO lists (title, color) SELECT '${DEFAULT_LIST_NAME}', '${DEFAULT_LIST_COLOR}' WHERE NOT EXISTS (SELECT * FROM lists);
`;

let sqliteLoader = null;
let sqlitePromiser = null;

function loadSQLite() {
  if (!sqliteLoader) {
    sqliteLoader = new Promise((resolve, reject) => {
      let script = document.createElement("script");
      script.setAttribute("src", "./sqlite-wasm-3400000/jswasm/sqlite3-worker1-promiser.js");
      script.setAttribute("async", "true");
      document.body.appendChild(script);
      script.addEventListener("load", resolve);
      script.addEventListener("error", reject);
    });
  }
  return sqliteLoader;
}

export async function initDB() {
  await loadSQLite();

  return new Promise((resolve, reject) => {
    sqlitePromiser = sqlite3Worker1Promiser(() => {
      async function start() {
        try {
          // Open the DB.
          await sqlitePromiser("open", {
            filename: `file:${DB_FILE_NAME}?vfs=opfs`,
            create: true,
          });

          // Create tables if needed.
          await sqlitePromiser("exec", {
            sql: SQL_NEW_TABLES,
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      }

      start();
    });
  });
}

// TODO
// export async function importDBFile(file) {
//   let root = await navigator.storage.getDirectory();

//   const dirs = DB_FILE_NAME.split("/");
//   const fileName = dirs.pop();

//   for (const dir of dirs) {
//     root = await root.getDirectoryHandle(dir);
//   }

//   const fileHandle = await root.getFileHandle(fileName);

//   // Overwrite the file with the new one.
//   await fileHandle.remove();
//   const newFileHandle = await root.getFileHandle(fileName, { create: true });

//   const writable = await newFileHandle.createWritable();
//   await writable.write(file);
//   await writable.close();
// }

export async function getDBFile() {
  let root = await navigator.storage.getDirectory();

  const dirs = DB_FILE_NAME.split("/");
  const fileName = dirs.pop();

  for (const dir of dirs) {
    root = await root.getDirectoryHandle(dir);
  }

  const fileHandle = await root.getFileHandle(fileName);
  return fileHandle.getFile();
}

export async function createTask(title, listId) {
  await sqlitePromiser("exec", {
    sql: `INSERT INTO tasks (title, completed, notes, has_file, due_by, list_id) VALUES ('${title}', 0, '', 0, 0, ${listId});`
  });
}

export async function addTaskNotes(taskId, notes) {
  await sqlitePromiser("exec", {
    sql: `UPDATE tasks SET notes = '${notes}' WHERE id = ${taskId};`
  });
}

export async function renameTask(taskId, title) {
  await sqlitePromiser("exec", {
    sql: `UPDATE tasks SET title = '${title}' WHERE id = ${taskId};`
  });
}

export async function completeTask(taskId, completed) {
  await sqlitePromiser("exec", {
    sql: `UPDATE tasks SET completed = ${completed ? 1 : 0} WHERE id = ${taskId};`
  });
}

export async function setTaskHasFile(taskId, hasFile) {
  await sqlitePromiser("exec", {
    sql: `UPDATE tasks SET has_file = ${hasFile ? 1 : 0} WHERE id = ${taskId};`
  });
}

export async function setTaskDueBy(taskId, dueBy) {
  await sqlitePromiser("exec", {
    sql: `UPDATE tasks SET due_by = ${dueBy} WHERE id = ${taskId};`
  });
}

export async function deleteTask(taskId) {
  await sqlitePromiser("exec", {
    sql: `DELETE FROM tasks WHERE id = ${taskId};`
  });
}

export async function createList(title, color) {
  const list = await sqlitePromiser("exec", {
    sql: `INSERT INTO lists (title, color) VALUES ('${title}', '${color}');
          SELECT * FROM lists WHERE rowid = (SELECT last_insert_rowid());`,
    resultRows: [], columnNames: [],
  });

  return formatResult(list);
}

export async function renameList(listId, title) {
  await sqlitePromiser("exec", {
    sql: `UPDATE lists SET title = '${title}' WHERE id = ${listId};`
  });
}

export async function changeListColor(listId, color) {
  await sqlitePromiser("exec", {
    sql: `UPDATE lists SET color = '${color}' WHERE id = ${listId};`
  });
}

export async function getLists() {
  const lists = await sqlitePromiser("exec", {
    sql: `
      SELECT lists.id, lists.title, lists.color, count(tasks.id) as nb_tasks
      FROM lists
      LEFT JOIN tasks ON lists.id = tasks.list_id
      GROUP BY lists.id, lists.title, lists.color;
    `,
    resultRows: [], columnNames: [],
  });

  return formatResult(lists);
}

export async function getListTasks(listId) {
  const tasks = await sqlitePromiser("exec", {
    sql: `SELECT * FROM tasks WHERE list_id = ${listId};`,
    resultRows: [], columnNames: [],
  });

  return formatResult(tasks);
}

export async function searchTasks(query) {
  const tasks = await sqlitePromiser("exec", {
    sql: `
      SELECT tasks.*, lists.title as list_title, lists.color as list_color FROM tasks
      LEFT JOIN lists ON tasks.list_id = lists.id
      WHERE (tasks.title LIKE '%${query}%' OR tasks.notes LIKE '%${query}%');
    `,
    resultRows: [], columnNames: [],
  });

  return formatResult(tasks);
}

export async function getTodaysTasks() {
  // Get all tasks with a due date today, that have not yet been completed.
  const dayStart = new Date();
  dayStart.setHours(0);
  dayStart.setMinutes(0);
  dayStart.setSeconds(0);
  dayStart.setMilliseconds(0);
  const start = dayStart.getTime();

  const tasks = await sqlitePromiser("exec", {
    sql: `
      SELECT tasks.*, lists.title as list_title, lists.color as list_color FROM tasks
      LEFT JOIN lists ON tasks.list_id = lists.id
      WHERE tasks.completed = 0 AND tasks.due_by > 0 AND tasks.due_by >= ${start} AND tasks.due_by < ${start + 86400000};
    `,
    resultRows: [], columnNames: [],
  });

  return formatResult(tasks);
}

export async function getOverdueTasks() {
  // Get all tasks that are not completed but that have a due date in the past.
  const dayStart = new Date();
  dayStart.setHours(0);
  dayStart.setMinutes(0);
  dayStart.setSeconds(0);
  dayStart.setMilliseconds(0);
  const time = dayStart.getTime();

  const tasks = await sqlitePromiser("exec", {
    sql: `
      SELECT tasks.*, lists.title as list_title, lists.color as list_color FROM tasks
      LEFT JOIN lists ON tasks.list_id = lists.id
      WHERE tasks.completed = 0 AND tasks.due_by > 0 AND tasks.due_by < ${time};
    `,
    resultRows: [], columnNames: [],
  });

  return formatResult(tasks);
}

export async function deleteList(listId) {
  await sqlitePromiser("exec", {
    sql: `DELETE FROM lists WHERE id = ${listId};`
  });
  await sqlitePromiser("exec", {
    sql: `DELETE FROM tasks WHERE list_id = ${listId};`
  });
}

function formatResult(selectResult) {
  const { resultRows, columnNames } = selectResult.result;
  const formatted = [];
  for (const row of resultRows) {
    const obj = {};
    for (let i = 0; i < row.length; i++) {
      obj[columnNames[i]] = row[i];
    }
    formatted.push(obj);
  }
  return formatted;
}

// TODO: REMOVE, ONLY FOR DEBUG
window.exec = async function (sql) {
  const res = await sqlitePromiser("exec", {
    sql,
    resultRows: [], columnNames: [],
  });

  console.log(formatResult(res));
}

// TODO: REMOVE, ONLY FOR DEBUG
window.getTodaysTasks = getTodaysTasks;
