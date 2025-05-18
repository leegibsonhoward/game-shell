// src/core/SceneManager.js
let currentScene = null;

export default class SceneManager {
  static changeScene(newScene) {
    if (currentScene?.unload) currentScene.unload();
    currentScene = newScene;
    if (currentScene?.load) currentScene.load();
  }

  static update(deltaTime) {
    if (currentScene?.update) currentScene.update(deltaTime);
  }

  static render(ctx) {
    if (currentScene?.render) currentScene.render(ctx);
  }

  static getScene() {
    return currentScene;
  }
}
