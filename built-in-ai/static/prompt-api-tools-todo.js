const promptEl = document.querySelector("#prompt");
const systemPromptEl = document.querySelector("#system-prompt");
const toolsEl = document.querySelector("#tools");
const toolTemplateEl = document.querySelector("#tool-template");
const addToolBtn = document.querySelector("#add-tool");
const sendResultsEl = document.querySelector("#send-results");
const maxRoundsEl = document.querySelector("#max-rounds");
const runBtn = document.querySelector("#run");
const stopBtn = document.querySelector("#stop");
const outputEl = document.querySelector("#output");

const todoListEl = document.querySelector("#todo-list");
const todoCountEl = document.querySelector("#todo-count");
const resetTodosBtn = document.querySelector("#reset-todos");

const INITIAL_TODOS = [
  { id: 1, text: "Buy milk", done: false },
  { id: 2, text: "Call mom", done: true },
  { id: 3, text: "Book dentist appointment", done: false },
  { id: 4, text: "Water the plants", done: true },
  { id: 5, text: "Reply to Alex's email", done: false }
];

let todos = [];
let nextTodoId = 1;

function resetTodos() {
  todos = INITIAL_TODOS.map(todo => ({ ...todo }));
  nextTodoId = todos.length + 1;
  renderTodos();
}

// Renders the todo list. The item with the flashId id gets highlighted.
function renderTodos(flashId) {
  todoListEl.textContent = "";

  for (const todo of todos) {
    const li = createEl("li", "todo" + (todo.done ? " done" : "") + (todo.id === flashId ? " flash" : ""));
    li.dataset.id = todo.id;

    const checkbox = createEl("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      renderTodos(todo.id);
    });

    const label = createEl("label");
    label.append(checkbox, createEl("span", "todo-text", todo.text));
    li.append(label, createEl("span", "todo-id", `id ${todo.id}`));
    todoListEl.appendChild(li);
  }

  if (!todos.length) {
    todoListEl.appendChild(createEl("li", "todo-empty", "The list is empty."));
  }

  todoCountEl.textContent = `${todos.filter(todo => todo.done).length} of ${todos.length} done`;
}

function findTodo(args) {
  const todo = todos.find(t => t.id === Number(args?.id));
  if (!todo) {
    throw new Error(`There is no todo with the id ${args?.id}. Use list_todos to see the ids.`);
  }
  return todo;
}

function setTodoDone(args, done) {
  const todo = findTodo(args);
  todo.done = done;
  renderTodos(todo.id);
  return { ...todo };
}

// The tools that really run, and change the todo list on the page.
const TODO_HANDLERS = {
  list_todos: () => ({ todos: todos.map(todo => ({ ...todo })) }),
  add_todo: args => {
    const text = String(args?.text ?? "").trim();
    if (!text) {
      throw new Error("The text argument is required.");
    }
    const todo = { id: nextTodoId++, text, done: false };
    todos.push(todo);
    renderTodos(todo.id);
    return { ...todo };
  },
  complete_todo: args => setTodoDone(args, true),
  uncomplete_todo: args => setTodoDone(args, false),
  delete_todo: args => {
    const todo = findTodo(args);
    todos = todos.filter(t => t !== todo);
    todoListEl.querySelector(`[data-id="${todo.id}"]`)?.classList.add("removing");
    setTimeout(() => renderTodos(), 400);
    return { deleted: { ...todo } };
  }
};

const idSchema = {
  type: "object",
  properties: {
    id: { type: "integer", description: "The id of the todo, as returned by list_todos." }
  },
  required: ["id"]
};

const DEFAULT_TOOLS = [
  {
    name: "list_todos",
    description: "List all the todos, with their id, text, and whether they are done.",
    inputSchema: { type: "object", properties: {} },
    handler: TODO_HANDLERS.list_todos
  },
  {
    name: "add_todo",
    description: "Add a new todo to the list. It starts as not done.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "What needs to be done." }
      },
      required: ["text"]
    },
    handler: TODO_HANDLERS.add_todo
  },
  {
    name: "complete_todo",
    description: "Mark a todo as done.",
    inputSchema: idSchema,
    handler: TODO_HANDLERS.complete_todo
  },
  {
    name: "uncomplete_todo",
    description: "Mark a todo as not done.",
    inputSchema: idSchema,
    handler: TODO_HANDLERS.uncomplete_todo
  },
  {
    name: "delete_todo",
    description: "Delete a todo from the list.",
    inputSchema: idSchema,
    handler: TODO_HANDLERS.delete_todo
  }
];

function addToolRow(tool = { name: "", description: "", inputSchema: { type: "object", properties: {} }, result: {} }, open = true) {
  const row = toolTemplateEl.content.firstElementChild.cloneNode(true);
  const nameEl = row.querySelector(".tool-name");
  const descriptionEl = row.querySelector(".tool-description");
  const updateSummary = () => {
    row.querySelector(".tool-summary-name").textContent = nameEl.value.trim() || "(unnamed tool)";
    row.querySelector(".tool-summary-description").textContent = descriptionEl.value.trim();
  };

  nameEl.value = tool.name;
  descriptionEl.value = tool.description;
  row.querySelector(".tool-schema").value = JSON.stringify(tool.inputSchema, null, 2);
  row.handler = tool.handler;
  if (tool.handler) {
    row.querySelector(".tool-result-label").hidden = true;
    row.querySelector(".tool-builtin-note").hidden = false;
  } else {
    row.querySelector(".tool-result").value = JSON.stringify(tool.result, null, 2);
  }
  nameEl.addEventListener("input", updateSummary);
  descriptionEl.addEventListener("input", updateSummary);
  row.querySelector(".remove-tool").addEventListener("click", () => row.remove());
  row.open = open;
  updateSummary();
  toolsEl.appendChild(row);
  return row;
}

DEFAULT_TOOLS.forEach(tool => addToolRow(tool, false));
resetTodos();
resetTodosBtn.addEventListener("click", resetTodos);
addToolBtn.addEventListener("click", () => addToolRow().querySelector(".tool-name").focus());

// Reads the tool rows. Returns the declared tools, and the functions that run them by tool name.
function readTools() {
  const tools = [];
  const impls = {};

  for (const row of toolsEl.querySelectorAll(".tool")) {
    const name = row.querySelector(".tool-name").value.trim();
    if (!name) {
      throw new Error("Every tool needs a name.");
    }

    let inputSchema, result;
    try {
      inputSchema = JSON.parse(row.querySelector(".tool-schema").value);
    } catch (e) {
      throw new Error(`Invalid input schema JSON for tool "${name}": ${e.message}`);
    }
    if (!row.handler) {
      try {
        const resultText = row.querySelector(".tool-result").value.trim();
        result = resultText ? JSON.parse(resultText) : {};
      } catch (e) {
        throw new Error(`Invalid mock result JSON for tool "${name}": ${e.message}`);
      }
    }

    tools.push({
      name,
      description: row.querySelector(".tool-description").value.trim(),
      inputSchema
    });
    impls[name] = row.handler ?? (() => result);
  }

  return { tools, impls };
}

const streamEl = document.querySelector("#stream");

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function formatArgs(args) {
  return Object.entries(args ?? {}).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(", ");
}

// A compact timeline of what happens during a run.
class RunLog {
  constructor(root) {
    this.root = root;
    this.root.textContent = "";
    this.textBlock = null;
  }

  // A one-line step with a pulsing dot while it's running. Call done() to finish it.
  step(label, timed = true) {
    const row = createEl("div", "step running");
    const labelEl = createEl("span", "step-label", label);
    const detailEl = createEl("span", "step-detail");
    row.append(createEl("span", "dot"), labelEl, detailEl);
    this.root.appendChild(row);
    this.textBlock = null;
    const start = performance.now();
    return {
      done: (detail = "", isError = false) => {
        row.classList.remove("running");
        row.classList.toggle("error", isError);
        const ms = Math.round(performance.now() - start);
        detailEl.textContent = [detail, timed ? (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`) : ""].filter(Boolean).join(" · ");
      }
    };
  }

  // Appends streamed text to the current text block, creating one if needed.
  appendText(text) {
    if (!this.textBlock) {
      this.textBlock = createEl("div", "text-block");
      this.root.appendChild(this.textBlock);
    }
    this.textBlock.textContent += text;
  }

  // A collapsible tool call, showing the arguments in the summary, and the details inside.
  toolCall(call, result, isError) {
    const details = createEl("details", "call" + (isError ? " error" : ""));
    const summary = createEl("summary");
    summary.append(
      createEl("span", "call-name", call.name),
      createEl("span", "call-args", `(${formatArgs(call.arguments)})`),
      createEl("span", "call-status", isError ? "✕ error" : "✓")
    );
    const body = createEl("div", "call-body");
    body.append(
      createEl("div", "call-label", "Arguments"),
      createEl("pre", "", JSON.stringify(call.arguments, null, 2)),
      createEl("div", "call-label", isError ? "Error sent to the model" : "Result sent to the model"),
      createEl("pre", "", isError ? String(result) : JSON.stringify(result, null, 2)),
      createEl("div", "call-label", `callId: ${call.callId}`)
    );
    details.append(summary, body);
    this.root.appendChild(details);
    this.textBlock = null;
  }
}

// Normalizes what the model returns (a full response, or a streamed chunk) into { type, value } items.
function* getItems(chunk) {
  if (typeof chunk === "string") {
    yield { type: "text", value: chunk };
  } else if (Array.isArray(chunk)) {
    yield* chunk;
  } else if (chunk && chunk.type) {
    yield chunk;
  }
}

addEventListener("load", async () => {
  const metricsPanelEl = document.querySelector(".metrics");
  if (metricsPanelEl) {
    const toggleBtn = createEl("button", "metrics-toggle", "Show metrics");
    toggleBtn.type = "button";
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.addEventListener("click", () => {
      const expanded = metricsPanelEl.classList.toggle("expanded");
      toggleBtn.textContent = expanded ? "Hide metrics" : "Show metrics";
      toggleBtn.setAttribute("aria-expanded", expanded);
    });
    metricsPanelEl.prepend(toggleBtn);
  }

  try {
    await checkLanguageModelAPIAvailability();
  } catch (e) {
    console.error(e);
    return;
  }

  if (!("LanguageModelToolCall" in window)) {
    displaySessionMessage(
      "Tool use isn't available in this browser. Enable the <strong>Prompt API Tool Use</strong> flag at edge://flags and restart the browser. " + PROMPT_DOCS_INSTRUCTIONS,
      true
    );
  }

  let session = null;
  let abortController;

  stopBtn.addEventListener("click", () => {
    abortController?.abort("User stopped the conversation");
    abortController = null;
    session?.destroy();
  });

  runBtn.addEventListener("click", async () => {
    if (!promptEl.value.trim()) {
      return;
    }

    let tools, impls;
    try {
      ({ tools, impls } = readTools());
    } catch (e) {
      displaySessionMessage(e.message, true);
      return;
    }

    session?.destroy();
    abortController?.abort();

    const log = new RunLog(outputEl);
    const metricsEl = document.querySelector(".metrics");
    metricsEl.classList.toggle("no-stream-mode", !streamEl.checked);
    metricsEl.querySelectorAll(".value").forEach(el => el.textContent = "");
    const metrics = new PlaygroundMetrics();
    metrics.signalOnBeforeCreateSession();
    const systemPrompt = systemPromptEl.value.trim();
    const options = {
      expectedInputs: [{ type: "tool-response" }],
      expectedOutputs: [{ type: "tool-call" }],
      tools
    };
    if (systemPrompt) {
      options.initialPrompts = [{ role: "system", content: systemPrompt }];
    }

    console.log("Creating a session with", options);

    const sessionStep = log.step(`Creating a session with ${tools.length} tool${tools.length === 1 ? "" : "s"}`);
    try {
      session = await getLanguageModelSession(options);
      sessionStep.done();
      metrics.signalOnAfterSessionCreated();
    } catch (e) {
      sessionStep.done("failed", true);
      console.error(e);
      return;
    }

    const controller = new AbortController();
    abortController = controller;
    const signal = controller.signal;
    let turnStep = null;

    try {
      const maxRounds = Math.max(1, parseInt(maxRoundsEl.value, 10) || 5);
      let input = promptEl.value;
      let totalCalls = 0;

      for (let turn = 1; turn <= maxRounds; turn++) {
        turnStep = log.step(turn === 1 ? "Asking the model" : "Sending the tool results to the model");

        const toolResponses = [];
        const seenCallIds = new Set();
        let hasText = false;

        const handleItem = async item => {
          if (streamEl.checked && (item.type === "text" || item.type === "tool-call")) {
            metrics.signalOnStreamToken();
          }
          if (item.type === "text" && item.value) {
            hasText = true;
            log.appendText(item.value);
          } else if (item.type === "tool-call" && !seenCallIds.has(item.value.callId)) {
            const call = item.value;
            seenCallIds.add(call.callId);
            totalCalls++;

            let result;
            let errorMessage = null;
            if (call.name in impls) {
              try {
                result = await impls[call.name](call.arguments);
              } catch (e) {
                errorMessage = e.message;
              }
            } else {
              errorMessage = `Unknown tool: ${call.name}`;
            }

            if (errorMessage === null) {
              log.toolCall(call, result, false);
              toolResponses.push({
                type: "tool-response",
                value: new LanguageModelToolSuccess({
                  callId: call.callId,
                  name: call.name,
                  result: [{ type: "object", value: result }]
                })
              });
            } else {
              log.toolCall(call, errorMessage, true);
              toolResponses.push({
                type: "tool-response",
                value: new LanguageModelToolError({ callId: call.callId, name: call.name, errorMessage })
              });
            }
          }
        };

        if (turn === 1) {
          metrics.signalOnBeforeStream();
        }

        if (streamEl.checked) {
          let isFirstChunk = true;
          for await (const chunk of session.promptStreaming(input, { signal })) {
            if (isFirstChunk) {
              console.log("First streamed chunk", chunk);
              isFirstChunk = false;
            }
            for (const item of getItems(chunk)) {
              await handleItem(item);
            }
          }
        } else {
          const response = await session.prompt(input, { signal });
          console.log(`Turn ${turn} response`, response);
          for (const item of getItems(response)) {
            await handleItem(item);
          }
        }

        const callCount = toolResponses.length;
        turnStep.done(callCount ? `${callCount} tool call${callCount === 1 ? "" : "s"}` : hasText ? "text response" : "empty response");
        turnStep = null;

        if (!callCount) {
          log.step(totalCalls ? "Done" : "Done: the model did not call any tool", false).done();
          break;
        }
        if (!sendResultsEl.checked) {
          log.step("Done: not sending the results back", false).done();
          break;
        }
        if (turn === maxRounds) {
          log.step(`Stopped after ${maxRounds} rounds`, false).done();
          break;
        }

        input = [{ role: "user", content: toolResponses }];
      }
    } catch (e) {
      const stopped = signal.aborted;
      turnStep?.done(stopped ? "stopped" : "failed", !stopped);
      if (!stopped) {
        displaySessionMessage(`Could not generate a response: ${e}`, true);
        console.error(e);
      }
    } finally {
      metrics.signalOnAfterResult();
    }
  });
});

