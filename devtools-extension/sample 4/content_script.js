document.addEventListener("click", (event) => {
  chrome.runtime.sendMessage({
      click: true,
      xPosition: event.clientX + document.body.scrollLeft,
      yPosition: event.clientY + document.body.scrollTop
    },
    response => {
      console.log("Received response", response);
    }
  );
});
