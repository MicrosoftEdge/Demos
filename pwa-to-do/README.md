# PWA To Do


<!-- ====================================================================== -->
## About the sample

**PWA To Do** is a simple To Do list app that lets you create lists of tasks locally in your browser, or by installing the app.

The data storage is done by using the [WebAssembly build of SQLite3](https://sqlite.org/wasm/) and origin-private file system.

This application serves as a browser storage demo for applications that need to store user data locally and query it in interesting ways.

This application uses:
* The WebAssembly build of SQLite3.
* The Origin-Private File System (OPFS) API.

To learn how to use SQLite3, see `db.js`.


<!-- ====================================================================== -->
## Open the sample

To open this sample:

1. Go to [PWA file handlers demo](https://microsoftedge.github.io/Demos/pwa-to-do/).

1. In the Address bar, click the **App available** button.

   The app is installed.

1. Open the installed app in its own window.


<!-- ====================================================================== -->
## Possible enhancements for this demo<!-- todo -->

* Add a way to import the database via a file.
   * Escape strings before inserting into SQLite.
* Sort tasks by most recent tasks, and separate completed tasks vs. todo tasks.
   * Allow manually sorting the tasks.


<!-- ====================================================================== -->
## See also

* [Progressive Web Apps (PWAs) documentation](https://learn.microsoft.com/microsoft-edge/progressive-web-apps/landing/)
