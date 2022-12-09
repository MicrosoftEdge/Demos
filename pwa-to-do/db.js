const DB_FILE_NAME = 'pwa-to-do/db';
const DEFAULT_LIST_NAME = 'My list'
const SQL_NEW_TABLES = `
  CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, notes TEXT, list_id INTEGER);
  CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY, title TEXT);
  INSERT INTO lists (title) SELECT '${DEFAULT_LIST_NAME}' WHERE NOT EXISTS (SELECT * FROM lists);
`;

let sqlitePromiser = null;

function loadSQLite() {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.setAttribute("src", "./sqlite-wasm-3400000/jswasm/sqlite3-worker1-promiser.js");
    script.setAttribute("async", "true");
    document.body.appendChild(script);
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);
  });
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

export async function createTask(title, listId) {
  await sqlitePromiser("exec", {
    sql: `INSERT INTO tasks (title, completed, notes, list_id) VALUES ('${title}', 0, '', ${listId});`
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

export async function deleteTask(taskId) {
  await sqlitePromiser("exec", {
    sql: `DELETE FROM tasks WHERE id = ${taskId};`
  });
}

export async function createList(title) {
  const list = await sqlitePromiser("exec", {
    sql: `INSERT INTO lists (title) VALUES ('${title}');
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

export async function getLists() {
  const lists = await sqlitePromiser("exec", {
    sql: `
      SELECT lists.id, lists.title, count(tasks.id) as nb_tasks
      FROM lists
      LEFT JOIN tasks ON lists.id = tasks.list_id
      GROUP BY lists.id, lists.title;
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
      SELECT tasks.*, lists.title as list_title FROM tasks
      LEFT JOIN lists ON tasks.list_id = lists.id
      WHERE (tasks.title LIKE '%${query}%' OR tasks.notes LIKE '%${query}%');
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
window.exec = async function(sql) {
  const res = await sqlitePromiser("exec", {
    sql,
    resultRows: [], columnNames: [],
  });

  console.log(formatResult(res));
}