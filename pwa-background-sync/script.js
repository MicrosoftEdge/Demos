const form = document.getElementById("comment-form");
const comment = document.getElementById("comment");
const responses = document.getElementById("responses");

const STATUSES = {
  "sent": "Sent",
  "sending": "Sending",
  "failed": "Failed",
  "retry-later": "Will try later",
};

comment.focus();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  handleFormSubmit(comment.value)
  comment.value = "";
});

function createCommentID() {
  return crypto.randomUUID();
}

async function handleFormSubmit(str) {
  // Display the sent comment immediately.
  const commentEl = displayComment(str);

  setCommentStatus(commentEl, "sending");

  // Post the comment to the server.
  const sent = await sendCommentToServer(str);

  setCommentStatus(commentEl, sent ? "sent" : "failed");
}

async function sendCommentToServer(str) {
  // Simulate some more network latency.
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 500));

  try {
    // Post the comment to the server.
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: str,
        body: str,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    await response.json();
    return true;
  } catch (error) {
    console.error("Error posting comment:", error);
    return false;
  }
}

function displayComment(str) {
  const id = createCommentID();

  const li = document.createElement("li");
  li.dataset.str = str;
  li.setAttribute("tabindex", "0");
  li.id = id;

  const msg = document.createElement("span");
  msg.classList.add("message");
  msg.textContent = str;
  li.appendChild(msg);

  const status = document.createElement("span");
  status.classList.add("status");
  li.appendChild(status);

  li.setAttribute("data-status", "sending");

  responses.prepend(li);

  return li;
}

function setCommentStatus(commentEl, status) {
  const statusText = STATUSES[status] || "";

  commentEl.setAttribute("data-status", status);

  const statusEl = commentEl.querySelector(".status");
  statusEl.textContent = statusText;

  if (status === "failed") {
    displayRetryButton(commentEl);
  } else {
    const retryButton = commentEl.querySelector("button.retry");
    if (retryButton) {
      retryButton.remove();
    }
  }
}

function displayRetryButton(commentEl) {
  const retryButton = document.createElement("button");
  retryButton.classList.add("retry");
  retryButton.textContent = "Try sending again";

  commentEl.appendChild(retryButton);

  retryButton.addEventListener("click", async () => {
    if (navigator.onLine) {
      setCommentStatus(commentEl, "sending");
      const sent = await sendCommentToServer(commentEl.dataset.str);
      setCommentStatus(commentEl, sent ? "sent" : "failed");
    } else {
      console.log("Use background sync");

      setCommentStatus(commentEl, "retry-later");
      handleOfflineMessageRetry(commentEl.id);
    }
  });
}

async function handleOfflineMessageRetry(id) {
  const registration = await navigator.serviceWorker.ready;

  if (!registration.sync) {
    console.log("Background Sync not supported");
    return;
  }

  console.log(`Registering sync for message ID: ${id}`);
  await registration.sync.register(`retry-message-${id}`);
}

navigator.serviceWorker.onmessage = async (event) => {
  if (event.data && event.data.type !== "retry-message") {
    return;
  }

  const id = event.data.tag.replace("retry-message-", "");
  const commentEl = document.getElementById(id);

  if (!commentEl) {
    return;
  }

  console.log(`Retrying message ID: ${id}`);
  setCommentStatus(commentEl, "sending");
  const sent = await sendCommentToServer(commentEl.dataset.str);
  setCommentStatus(commentEl, sent ? "sent" : "failed");
};
