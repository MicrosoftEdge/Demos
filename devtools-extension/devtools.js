let availableMemoryCapacity;
let totalMemoryCapacity;
let youClickedOn;

chrome.devtools.panels.create("Custom", "icon.png", "panel.html", panel => {
    // code invoked on panel creation
    panel.onShown.addListener( (extPanelWindow) => {
        // memory
        availableMemoryCapacity = extPanelWindow.document.querySelector('#availableMemoryCapacity');
        totalMemoryCapacity = extPanelWindow.document.querySelector('#totalMemoryCapacity');
        // 2-way message sending
        let sayHello = extPanelWindow.document.querySelector('#sayHello');
        youClickedOn = extPanelWindow.document.querySelector('#youClickedOn');
        sayHello.addEventListener("click", () => {
            // show a greeting alert in the inspected page
            chrome.devtools.inspectedWindow.eval('alert("Hello from the DevTools extension!");');
        });
    });
});

// Update Memory display
setInterval(() => {
    chrome.system.memory.getInfo((data) => {
        if (availableMemoryCapacity) {
            availableMemoryCapacity.innerHTML = data.availableCapacity;
        }
        if (totalMemoryCapacity) {
            totalMemoryCapacity.innerHTML = data.capacity;
        }
    });
}, 1000);

// Send message from inspected page to DevTools
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Messages from content scripts should have sender.tab set
    if (sender.tab && request.click == true) {
        console.log('I am here!');
        if (youClickedOn) {
            youClickedOn.innerHTML = `(${request.xPosition}, ${request.yPosition})`;
        }
        sendResponse({
            xPosition: request.xPosition,
            yPosition: request.yPosition
        });
    }
});

// Create a connection to the background service worker
const backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

// Relay the tab ID to the background service worker
backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});
