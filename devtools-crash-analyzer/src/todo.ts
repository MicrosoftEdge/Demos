import { TodoStatus } from './todo-status.js';
import { processUIString } from './util.js';

export class Todo {
  constructor(
    public id: number,
    public text: string,
    public status: TodoStatus,
  ) {}

  isCompleted() {
    return this.status === TodoStatus.COMPLETED;
  }

  markCompleted() {
    this.status = TodoStatus.COMPLETED;
  }

  markActive() {
    this.status = TodoStatus.ACTIVE;
  }

  render() {
    return todoMarkupBuilder(this);
  }

  onStateChange(callback: () => void) {}

  onRemove(callback: () => void) {}
}

function todoMarkupBuilder(todo: Todo) {
  return `<li>
    <input type="checkbox" ${todo.isCompleted() ? 'checked' : ''} />
    <span class="text">${processUIString(todo.text)}</span>
    <button>❌</button>
  </li>`;
}
