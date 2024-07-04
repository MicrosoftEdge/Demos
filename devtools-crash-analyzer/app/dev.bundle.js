/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _todo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todo.js */ "./src/todo.ts");
/* harmony import */ var _todo_status_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./todo-status.js */ "./src/todo-status.ts");


var App = /** @class */ (function () {
    function App(element) {
        this.element = element;
        this.todos = [];
        // Create a few tasks, for demo.
        this.todos.push(new _todo_js__WEBPACK_IMPORTED_MODULE_0__.Todo(1, 'Example task 1', _todo_status_js__WEBPACK_IMPORTED_MODULE_1__.TodoStatus.ACTIVE));
        this.todos.push(new _todo_js__WEBPACK_IMPORTED_MODULE_0__.Todo(2, 'Another example task', _todo_status_js__WEBPACK_IMPORTED_MODULE_1__.TodoStatus.COMPLETED));
        this.todos.push(new _todo_js__WEBPACK_IMPORTED_MODULE_0__.Todo(3, 'Something else to do', _todo_status_js__WEBPACK_IMPORTED_MODULE_1__.TodoStatus.ACTIVE));
        this.todos.push(new _todo_js__WEBPACK_IMPORTED_MODULE_0__.Todo(4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', _todo_status_js__WEBPACK_IMPORTED_MODULE_1__.TodoStatus.COMPLETED));
        this.render();
    }
    App.prototype.render = function () {
        var _this = this;
        this.element.innerHTML = "\n      <input type=\"text\" placeholder=\"What needs to be done?\" />\n      <ul>\n        ".concat(this.todos.map(function (todo) { return todo.render(); }).join(''), "\n      </ul>\n    ");
        var input = this.element.querySelector('input');
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                _this.todos.push(new _todo_js__WEBPACK_IMPORTED_MODULE_0__.Todo(_this.todos.length + 1, input.value, _todo_status_js__WEBPACK_IMPORTED_MODULE_1__.TodoStatus.ACTIVE));
                input.value = '';
                _this.render();
            }
        });
        var checkboxes = this.element.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox, index) {
            checkbox.addEventListener('change', function () {
                if (checkbox.checked) {
                    _this.todos[index].markCompleted();
                }
                else {
                    _this.todos[index].markActive();
                }
                _this.render();
            });
        });
        var buttons = this.element.querySelectorAll('button');
        buttons.forEach(function (button, index) {
            button.addEventListener('click', function () {
                _this.todos.splice(index, 1);
                _this.render();
            });
        });
    };
    return App;
}());



/***/ }),

/***/ "./src/todo-status.ts":
/*!****************************!*\
  !*** ./src/todo-status.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TodoStatus: () => (/* binding */ TodoStatus)
/* harmony export */ });
var TodoStatus;
(function (TodoStatus) {
    TodoStatus[TodoStatus["ACTIVE"] = 0] = "ACTIVE";
    TodoStatus[TodoStatus["COMPLETED"] = 1] = "COMPLETED";
})(TodoStatus || (TodoStatus = {}));


/***/ }),

/***/ "./src/todo.ts":
/*!*********************!*\
  !*** ./src/todo.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Todo: () => (/* binding */ Todo)
/* harmony export */ });
/* harmony import */ var _todo_status_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todo-status.js */ "./src/todo-status.ts");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./src/util.ts");


var Todo = /** @class */ (function () {
    function Todo(id, text, status) {
        this.id = id;
        this.text = text;
        this.status = status;
    }
    Todo.prototype.isCompleted = function () {
        return this.status === _todo_status_js__WEBPACK_IMPORTED_MODULE_0__.TodoStatus.COMPLETED;
    };
    Todo.prototype.markCompleted = function () {
        this.status = _todo_status_js__WEBPACK_IMPORTED_MODULE_0__.TodoStatus.COMPLETED;
    };
    Todo.prototype.markActive = function () {
        this.status = _todo_status_js__WEBPACK_IMPORTED_MODULE_0__.TodoStatus.ACTIVE;
    };
    Todo.prototype.render = function () {
        return todoMarkupBuilder(this);
    };
    Todo.prototype.onStateChange = function (callback) { };
    Todo.prototype.onRemove = function (callback) { };
    return Todo;
}());

function todoMarkupBuilder(todo) {
    return "<li>\n    <input type=\"checkbox\" ".concat(todo.isCompleted() ? 'checked' : '', " />\n    <span class=\"text\">").concat((0,_util_js__WEBPACK_IMPORTED_MODULE_1__.processUIString)(todo.text), "</span>\n    <button>\u274C</button>\n  </li>");
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processUIString: () => (/* binding */ processUIString)
/* harmony export */ });
function processUIString(str) {
    return shorten(capitalize(str), 30);
}
function shorten(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    }
    throw new Error("test error");
    return str.slice(0, maxLength) + '...';
}
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}


/***/ }),

/***/ "./node_modules/@microsoft/edge-devtools-crash-analyzer-support/dist/index.mjs":
/*!*************************************************************************************!*\
  !*** ./node_modules/@microsoft/edge-devtools-crash-analyzer-support/dist/index.mjs ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __esModule: () => (/* binding */ r),
/* harmony export */   installErrorStackModuleAnnotations: () => (/* binding */ t)
/* harmony export */ });
var e={};(()=>{var r=e;function t(e){const r=new Map;for(const t of e){const e=t.getFileName(),a=t.getScriptHash();e&&a&&r.set(e,a)}if(r.size){const e=["","Source modules:"];for(const[t,a]of r.entries())e.push(`    ${t} ${a}`);return e.join("\n")}}let a;function n(e,r){let n;return n=a?a.apply(Error,[e,r]):e.stack,t(r)?n+"\n"+t(r):n}Object.defineProperty(r,"X",{value:!0}),r.s=void 0,r.s=function(e){var r;"firstPrepareStackTrace"!==(null===(r=e.prepareStackTrace)||void 0===r?void 0:r.name)&&(a=e.prepareStackTrace,e.prepareStackTrace=function r(t,c){if(c.length>0){if("getScriptHash"in c[0].constructor.prototype)return e.prepareStackTrace===r&&(e.prepareStackTrace=n),n.apply(e,[t,c]);e.prepareStackTrace=a}return"function"==typeof a?a.apply(e,[t,c]):t.stack})}})();var r=e.X,t=e.s;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _microsoft_edge_devtools_crash_analyzer_support__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/edge-devtools-crash-analyzer-support */ "./node_modules/@microsoft/edge-devtools-crash-analyzer-support/dist/index.mjs");
/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.js */ "./src/app.ts");


if (false) {}
var appElement = document.querySelector('#app');
var app = new _app_js__WEBPACK_IMPORTED_MODULE_1__.App(appElement);

/******/ })()
;
//# sourceMappingURL=dev.bundle.js.map