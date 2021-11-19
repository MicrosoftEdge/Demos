const localforage = require('./localforage-1.10.0.min.js');

export class Store {
  constructor() { }

  async getAll() {
    const demos = {};

    const keys = await localforage.keys();
    for (const key of keys) {
      demos[key] = await localforage.getItem(key);
    }

    return demos;
  }

  async createNew(cssText, bgColor) {
    const id = getNewId();
    await this.set(id, cssText, bgColor);
    return id;
  }

  async set(id, cssText, bgColor) {
    const data = await this.get(id);
    const name = data ? data.name : null;
    await localforage.setItem(id, { cssText, bgColor, name });
  }

  async setName(id, name) {
    const data = await this.get(id);
    if (!data) {
      return;
    }

    data.name = name;
    await localforage.setItem(id, data);
  }

  async get(id) {
    return await localforage.getItem(id);
  }

  async delete(id) {
    await localforage.removeItem(id);
  }
}

function getNewId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const letter = () => chars.split('')[Math.floor(Math.random() * chars.length)];
  const prefix = new Array(5).fill().map(letter).join('');
  return prefix + '-' + Date.now();
}
