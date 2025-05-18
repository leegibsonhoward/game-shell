// src/core/AssetLoader.js
const cache = {};

export default class AssetLoader {
  static async loadImage(name, src) {
    if (cache[name]) return cache[name];
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        cache[name] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  static get(name) {
    return cache[name];
  }

  static clear() {
    Object.keys(cache).forEach(key => delete cache[key]);
  }
}
