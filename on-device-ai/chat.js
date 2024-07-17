import { Init, Query, Abort } from "./model.js";
import { marked } from "marked";

const preCannedQueries = {
  1: "Tell me about the lighthouse of Alexandria.",
  2: "Did the lighthouse of Alexandria existed at the same time the library of Alexandria existed?",
  3: "How did the Pharos lighthouse impact ancient maritime trade?",
  4: "Tell me about Constantinople.",
};

const clipboardIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>`;

marked.use({ mangle: false, headerIds: false });

const sendButton = document.getElementById("send-button");
const scrollWrapper = document.getElementById("scroll-wrapper");

//
// auto scroll the content area until a user scrolls up
//
let isAutoScrollOn = true;
let lastKnownScrollPosition = 0;
let ticking = false;

const autoScroller = new ResizeObserver(() => {
  if (isAutoScrollOn) {
    scrollWrapper.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});

document.addEventListener("scroll", () => {
  if (!ticking && isAutoScrollOn && window.scrollY < lastKnownScrollPosition) {
    window.requestAnimationFrame(() => {
      isAutoScrollOn = false;
      ticking = false;
    });
    ticking = true;
  } else if (
    !ticking &&
    !isAutoScrollOn &&
    window.scrollY > lastKnownScrollPosition &&
    window.scrollY >=
      document.documentElement.scrollHeight - window.innerHeight - 30
  ) {
    window.requestAnimationFrame(() => {
      isAutoScrollOn = true;
      ticking = false;
    });
    ticking = true;
  }
  lastKnownScrollPosition = window.scrollY;
});

//
// make response available for copying to clipboard
//
function copyTextToClipboard(responseDiv) {
  let elem = responseDiv;
  const copyButton = document.createElement("button");
  copyButton.className = "btn btn-secondary copy-button";
  copyButton.innerHTML = clipboardIcon;
  elem = copyButton;
  elem.onclick = () => {
    navigator.clipboard.writeText(responseDiv.innerText);
  };
  responseDiv.appendChild(elem);
}

//
// user hits send, enter or ctl enter
//
async function submitRequest(e) {
  if (sendButton.innerHTML == "Stop") {
    Abort();
    return;
  }

  // enter clears the chat history, ctl enter will continue the conversation
  const continuation = e.ctrlKey && e.key === "Enter";

  document.getElementById("chat-container").style.display = "block";

  let input = document.getElementById("user-input").value;
  if (input.length == 0) {
    document.getElementById("chat-history").context = "";
    let chatHistory = document.getElementById("chat-history");
    while (chatHistory.firstChild) {
      chatHistory.firstChild.remove();
    }
    return;
  }
  let context = document.getElementById("chat-history").context;
  if (context === undefined) {
    context = "";
  }

  // append to chat history
  let chatHistory = document.getElementById("chat-history");
  let userMessageDiv = document.createElement("div");
  userMessageDiv.className = "mb-2 user-message";
  userMessageDiv.innerText = input;
  chatHistory.appendChild(userMessageDiv);

  // container for llm response
  let responseDiv = document.createElement("div");
  responseDiv.className = "response-message mb-2 text-start";
  responseDiv.style.minHeight = "3em";
  let spinner = document.createElement("div");
  spinner.className = "spinner-border text-light";
  spinner.setAttribute("role", "status");
  responseDiv.appendChild(spinner);
  chatHistory.appendChild(responseDiv);

  // toggle button to stop text generation
  sendButton.innerHTML = "Stop";

  // change autoScroller to keep track of our new responseDiv
  autoScroller.observe(responseDiv);

  if (continuation) {
    input = context + " " + input;
  } else {
    input = `<|system|>\nYou are a friendly assistant.<|end|>\n<|user|>\n${input}<|end|>\n<|assistant|>\n`;
  }

  Query(input, (word) => {
    responseDiv.innerHTML = marked.parse(word);
  })
    .then(() => {
      chatHistory.context = responseDiv.innerHTML;
      copyTextToClipboard(responseDiv, true);
      sendButton.innerHTML = "Send";
      spinner.remove();
    })
    .catch((error) => {
      console.error(error);
      sendButton.innerHTML = "Send";
      spinner.remove();
    });

  // Clear user input
  document.getElementById("user-input").value = "";
}

//
// event listener for Ctrl+Enter or Enter
//
document.getElementById("user-input").addEventListener("keydown", function (e) {
  if (e.ctrlKey) {
    if (e.key === "Enter") {
      submitRequest(e);
    } else {
      const query = preCannedQueries[e.key];
      if (query) {
        document.getElementById("user-input").value = query;
        submitRequest(e);
      }
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    submitRequest(e);
  }
});

window.onload = () => {
  Init(true).then(() => {
    // adjustPadding();
    sendButton.addEventListener("click", submitRequest);
    const userInput = document.getElementById("user-input");
    document.getElementById("status").style.display = "none";
    userInput.focus();
  });
};
