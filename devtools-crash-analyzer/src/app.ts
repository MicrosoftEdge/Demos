import { Todo } from './todo.js';
import { TodoStatus } from './todo-status.js';

export class App {
  private todos: Todo[] = [];

  constructor(private element: HTMLElement) {
    // Create a few tasks, for demo.
    this.todos.push(new Todo(
      1,
      'Example task 1',
      TodoStatus.ACTIVE,
    ));
    this.todos.push(new Todo(
      2,
      'Another example task',
      TodoStatus.COMPLETED,
    ));
    this.todos.push(new Todo(
      3,
      'Something else to do',
      TodoStatus.ACTIVE,
    ));
    this.todos.push(new Todo(
      4,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      TodoStatus.COMPLETED,
    ));
    this.render();
  }

  private render() {
    this.element.innerHTML = `
      <input type="text" placeholder="What needs to be done?" />
      <ul>
        ${this.todos.map(todo => todo.render()).join('')}
      </ul>
    `;

    const input = this.element.querySelector('input') as HTMLInputElement;
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.todos.push(new Todo(
          this.todos.length + 1,
          input.value,
          TodoStatus.ACTIVE,
        ));
        input.value = '';
        this.render();
      }
    });

    const checkboxes = this.element.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: Element, index) => {
      checkbox.addEventListener('change', () => {
        if ((checkbox as HTMLInputElement).checked) {
          this.todos[index].markCompleted();
        } else {
          this.todos[index].markActive();
        }
        this.render();
      });
    });

    const buttons = this.element.querySelectorAll('button');
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.todos.splice(index, 1);
        this.render();
      });
    });
  }
}
