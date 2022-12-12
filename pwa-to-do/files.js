import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

export async function setFileForTask(taskId, file) {
  await set(`pwa-to-do-file-${taskId}`, file);
}

export async function getFileForTask(taskId) {
  return await get(`pwa-to-do-file-${taskId}`);
}

export async function deleteFileForTask(taskId) {
  await set(`pwa-to-do-file-${taskId}`, null);
}
