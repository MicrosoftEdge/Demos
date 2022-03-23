const cbs = [];

document.addEventListener("paste", (e) => {
  e.preventDefault();
  handlePaste();
});

async function handlePaste() {
  if (!navigator.clipboard || !navigator.clipboard.read) {
    displayUnsupportedMessage('The async clipboard API is not supported on this browser');
  }

  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const blob = await item.getType("text/html");
      const html = await blob.text();

      if (cbs.length) {
        const dom = new DOMParser().parseFromString(html, "text/html");
        for (const cb of cbs) {
          cb(dom);
        }
      }
    }
  } catch (e) {
    displayUnsupportedMessage('The async clipboard API is supported but failed to read the clipboard');
  }
}

export default function (callback) {
  cbs.push(callback);
}

function displayUnsupportedMessage(msg) {
  document.querySelector('.reader p').textContent = msg;
}
