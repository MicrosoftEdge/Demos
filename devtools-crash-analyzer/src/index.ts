import { installErrorStackModuleAnnotations } from '@microsoft/edge-devtools-crash-analyzer-support';
import { App } from './app.js';

if (process.env.NODE_ENV === "production") {
  installErrorStackModuleAnnotations(Error);
}

const appElement = document.querySelector('#app') as HTMLElement;
const app = new App(appElement);
