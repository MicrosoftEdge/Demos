# PWA To Do (under construction)

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/pwa-to-do/)** ⬅️

**PWA To Do** is a simple to do list application that lets you create lists of tasks locally in your browser, or by installing the app.

The data storage is done by using the [WebAssembly build of SQLite3](https://sqlite.org/wasm/) and origin-private file system.

Check out the code in the `db.js` file if you're interested in learning more about how to use SQLite3 in your own web app.

## TODO

* Add a way to import DB from file.
* Escape strings before inserting into SQLite.
* Sort tasks by most recent tasks, and separate completed vs. todo.
* Allow to sort tasks manually.
