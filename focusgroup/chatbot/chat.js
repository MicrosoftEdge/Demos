"use strict";

import ChatResponses from "./messages.js";

/* ============================================================
   Focusgroup Demo - Chatbot
   ============================================================
   focusgroup handles arrow-key navigation between messages and toolbar buttons.
   This file handles the remaining application logic:
   - Sending random cat facts in response to user messages
   - Manual "memory" using focusgroupstart

   Requires shared.js to be loaded first.
   ============================================================ */

// Short fake delay between sending a message and receiving a response
const RESPONSE_DELAY = 500;

// Simple unique ID suffix for messages
let ID_INDEX = 1;

const renderMessageToolbar = () => {
  const toolbarEl = document.createElement("div");
  toolbarEl.classList.add("message-actions");
  toolbarEl.setAttribute('focusgroup', 'toolbar nomemory');

  const actions = ["Copy", "Like", "Dislike", "Share"];
  actions.forEach(action => {
    const actionEl = document.createElement("button");
    actionEl.textContent = action;
    toolbarEl.appendChild(actionEl);
  });

  return toolbarEl;
}

const renderMessage = (message, isBotMessage) => {
  const messageEl = document.createElement("article");
  messageEl.textContent = message;
  messageEl.classList.add("message", isBotMessage ? "catbot" : "user");
  messageEl.tabIndex = 0;

  // Using a self-referencing aria-labelledby to force messages to be
  // explicitly labeled by their inner text content
  // This is needed to support Windows screen reader users arrowing in forms/focus mode
  messageEl.id = `message-${ID_INDEX++}`;
  messageEl.setAttribute('aria-labelledby', messageEl.id);

  // Add an actions toolbar and update focusgroupstart to the latest message for bot messages
  if (isBotMessage) {
    const messageToolbar = renderMessageToolbar();
    messageEl.prepend(messageToolbar);

    const previousStart = document.querySelector("[focusgroupstart]");
    if (previousStart) {
      previousStart.removeAttribute("focusgroupstart");
    }
    messageEl.setAttribute("focusgroupstart", "");
  }

  return messageEl;
};

const postMessage = (message, response) => {
  const messageList = document.getElementById("message-list");
  const userMessage = renderMessage(message, false);
  messageList.appendChild(userMessage);

  window.setTimeout(() => {
    const botMessage = renderMessage(response, true);
    messageList.appendChild(botMessage);

    // screen reader notification that reads the text of the bot response
    botMessage.ariaNotify(message);
  }, RESPONSE_DELAY);
};

// pick a random item from the ChatResponses, excluding previously used messages
const getRandomCatFact = (excludeMessages) => {
  if (excludeMessages.length >= ChatResponses.length) {
    excludeMessages.length = 0; // reset if we've used all messages
  }
  const availableMessages = ChatResponses.filter(msg => !excludeMessages.includes(msg));
  const randomCatFact = availableMessages[Math.floor(Math.random() * availableMessages.length)];
  excludeMessages.push(randomCatFact);
  return randomCatFact;
}

const onMessageFocusChange = (event) => {
  if (event.target.classList.contains("message")) {
    const previousStart = document.querySelector("[focusgroupstart]");
    if (previousStart) {
      previousStart.removeAttribute("focusgroupstart");
    }

    event.target.setAttribute("focusgroupstart", "");
  }
};

const initChat = () => {
  // prevent duplicate responses until all have been used
  const usedMessages = [];

  // attach submit event to chat input
  const chatInputForm = document.getElementById("chatinput");
  chatInputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const chatInput = chatInputForm.querySelector("input");
    if (chatInput.value.trim() !== "") {
      postMessage(chatInput.value.trim(), getRandomCatFact(usedMessages));
      chatInput.value = "";
    }
  });

  // listen to focus changes on the message list to update focusgroupstart
  const messageList = document.getElementById("message-list");
  messageList.addEventListener("focusin", onMessageFocusChange);
}

document.addEventListener("DOMContentLoaded", function () {
  initChat();
});
