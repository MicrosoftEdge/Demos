const roomSelectorEl = document.querySelector('.rooms');
const chatEl = document.querySelector('.chat');
const highTrafficBtn = document.querySelector('.high-traffic');
const lowTrafficBtn = document.querySelector('.low-traffic');
const stopBtn = document.querySelector('.stop-traffic');
const sendMsgBtn = document.querySelector('.send-message');

const rooms = {};
let currentRoom = null;

let FAKE_MSG_MAX_WAIT = 5000;
let FAKE_MSG_TIMEOUT = null;
let FAKE_MSG_ENABLED = false;

highTrafficBtn.addEventListener('click', fakeHighTraffic);
lowTrafficBtn.addEventListener('click', fakeLowTraffic);
stopBtn.addEventListener('click', stopFakeTraffic);
sendMsgBtn.addEventListener('click', createFakeMessage);

function fakeHighTraffic() {
    FAKE_MSG_ENABLED = true;
    clearTimeout(FAKE_MSG_TIMEOUT);
    FAKE_MSG_MAX_WAIT = 200;
    startFakeMessages();
}

function fakeLowTraffic() {
    FAKE_MSG_ENABLED = true;
    clearTimeout(FAKE_MSG_TIMEOUT);
    FAKE_MSG_MAX_WAIT = 5000;
    startFakeMessages();
}

function stopFakeTraffic() {
    clearTimeout(FAKE_MSG_TIMEOUT);
    FAKE_MSG_ENABLED = false;
}

function getFakeText() {
    let text = [];
    for (let i = 0; i < Math.ceil(Math.random() * 8); i++) {
        text.push(fakeTexts[Math.floor(Math.random() * fakeTexts.length)]);
    }
    return text.join('. ') + '.';
}

function createFakeMessage() {
    if (!currentRoom) {
        return;
    }

    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const text = getFakeText();
    const photo = fakePhotos[Math.floor(Math.random() * fakePhotos.length)];
    const color = fakeColor();

    currentRoom.addMessage(name, text, photo, color);
}

function startFakeMessages() {
    if (!currentRoom) {
        return;
    }

    if (FAKE_MSG_ENABLED) {
        createFakeMessage();
        FAKE_MSG_TIMEOUT = setTimeout(startFakeMessages, Math.floor(Math.random() * FAKE_MSG_MAX_WAIT));
    }
}

function getOrCreateRoom(id) {
    const room = rooms[id] ? rooms[id] : new Room(chatEl);
    return room;
}

function loadRoom(id) {
    if (currentRoom) {
        currentRoom.hide();
    }

    currentRoom = rooms[id] = getOrCreateRoom(id);
    currentRoom.show();

    roomSelectorEl.querySelectorAll('.active').forEach(r => r.classList.remove('active'));
    roomSelectorEl.querySelector(`[data-id="${id}"]`).classList.add('active');

    stopFakeTraffic();
}

function closeRoom(id) {
    roomSelectorEl.querySelector(`[data-id="${id}"]`).remove();

    if (rooms[id]) {
        if (rooms[id] === currentRoom) {
            stopFakeTraffic();

            for (const roomEl of [...roomSelectorEl.querySelectorAll('.room')]) {
                if (roomEl.dataset.id !== id) {
                    loadRoom(roomEl.dataset.id);
                    break;
                }
            }
        }

        rooms[id] = null;
    }
}

roomSelectorEl.addEventListener('click', e => {
    const closeBtn = e.target;
    if (!closeBtn.matches('.room .close')) {
        return;
    }

    const id = e.target.closest('.room').dataset.id;
    closeRoom(id);
});

roomSelectorEl.addEventListener('click', e => {
    const newRoom = e.target;
    if (!newRoom.matches('.room:not(.active)')) {
        return;
    }

    const id = newRoom.dataset.id;
    loadRoom(id);
});

loadRoom('r1');
