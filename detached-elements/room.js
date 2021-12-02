function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

const MAX_ROOM_MESSAGES = 20;

class Room {
    constructor(chatEl) {
        this.chatEl = chatEl;

        this.empty();

        this.cache = [];
        this.unmounted = [];

        // Manage the list of messages on an interval to make sure it doesn't exceed the maximum.
        // Store the extra messages in the cache for later reuse.
        this.maxMsgCleaner = setInterval(this.collectOldMessages.bind(this), 1000);
    }

    collectOldMessages() {
        // <<LEAK>>
        // There is a potential leak here. The cleanup occurs at a different rate than the
        // new message addition. We can easily find ourselves in a situation where we have
        // messages in the cache that don't need (or can't) be reused right away. This is not
        // likely to become too much, but the cache is per room, which multiplies the problem.
        // Should make just one cache for all, and monitor how many elements get into the cache
        // over time.
        if (this.chatEl.children.length > MAX_ROOM_MESSAGES) {
            const toRemove = this.chatEl.children.length - MAX_ROOM_MESSAGES;
            for (let i = 0; i < toRemove; i++) {
                this.cache.push(this.chatEl.children[0]);
                this.chatEl.children[0].remove();
            }
        }
    }

    empty() {
        this.chatEl.innerHTML = '';
    }

    hide() {
        this.chatEl.querySelectorAll('.message').forEach(el => {
            this.unmounted.push(el);
        });
        this.empty();
    }

    show() {
        this.empty();
        this.unmounted.forEach(el => {
            this.chatEl.appendChild(el);
        });
        // <<LEAK>>
        // this.unmounted should be emptied here. No need to keep the elements in this array once
        // the room was shown again.
        // This is a leak since the array will keep all messages present in a room when it is hidden
        // and they will remain here even if the elements are later removed from the DOM.

        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatEl.scrollTop = this.chatEl.scrollHeight;
    }

    // Create a new message to be added to the chat. Or reuse an existing one from the
    // cache if any.
    getOrCreateMessageEl(name, text, photo, color) {
        let template = this.cache.pop();
        if (!template) {
            template = document.createElement('div');
            template.classList.add('message');

            const photo = document.createElement('img');
            photo.classList.add('photo');
            photo.src = '';
            template.appendChild(photo);

            const name = document.createElement('p');
            name.classList.add('name');
            template.appendChild(name);

            const text = document.createElement('p');
            text.classList.add('text');
            template.appendChild(text);

            const time = document.createElement('datetime');
            time.classList.add('time');
            template.appendChild(time);
        }

        template.querySelector('.name').textContent = name;
        template.querySelector('.text').textContent = text;
        template.querySelector('.text').style.backgroundColor = color;
        template.querySelector('.time').textContent = getFormattedTime();
        template.querySelector('.time').style.backgroundColor = color;
        template.querySelector('.photo').src = `data:image/svg+xml;utf8,${photo}`;

        return template;
    }

    addMessage(name, text, photo, color) {
        this.chatEl.appendChild(this.getOrCreateMessageEl(name, text, photo, color));
        this.scrollToBottom();
    }
}
