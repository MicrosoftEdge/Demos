const copyEl = document.querySelector(".copy");
const copyButton = copyEl.querySelector("button");
const copySvgArea = copyEl.querySelector(".svg-area");

const pasteEl = document.querySelector(".paste");
const pasteButton = pasteEl.querySelector("button");
const pasteSvgArea = pasteEl.querySelector(".svg-area");

const supportNotice = document.querySelector(".support-notice");

// Start by loading the edge.svg image and displaying it in the copy area.
fetch("edge.svg")
  .then((response) => response.text())
  .then((text) => (copySvgArea.innerHTML = text));

// Update the support notice based on the browser's capabilities.
const supportsSVG = ("supports" in window.ClipboardItem) && window.ClipboardItem.supports("image/svg+xml");
if (!supportsSVG) {
  supportNotice.classList.add("no-support");
  supportNotice.textContent = "Your browser does not support reading or writing SVG to the clipboard.";
}

copyButton.addEventListener("click", async () => {
  if (!supportsSVG) {
    return;
  }

  // Get the SVG image as a Blob.
  const response = await fetch("edge.svg");
  const blob = await response.blob();

  // Store the SVG content in the clipboard.
  await navigator.clipboard.write([
    new window.ClipboardItem({
      [blob.type]: blob
    }),
  ]);
});

pasteButton.addEventListener("click", async () => {
  if (!supportsSVG) {
    return;
  }

  // On paste, read the system clipboard.
  const [clipboardItem] = await navigator.clipboard.read();
  const svgBlob = await clipboardItem.getType("image/svg+xml");
  if (!svgBlob) {
    alert("No SVG in the clipboard.");
    return;
  }

  // Getting the source code here, since :hover effects don't
  // work when the SVG is referenced as `<img src>`.
  const svgCode = await svgBlob.text();
  pasteSvgArea.innerHTML = svgCode;
});
