let availableMemoryCapacity;
let totalMemoryCapacity;

chrome.devtools.panels.create("Sample Panel", "icon.png", "panel.html", panel => {
    // code invoked on panel creation
    panel.onShown.addListener( (extPanelWindow) => {
        availableMemoryCapacity = extPanelWindow.document.querySelector('#availableMemoryCapacity');
        totalMemoryCapacity = extPanelWindow.document.querySelector('#totalMemoryCapacity');
    });
});

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
