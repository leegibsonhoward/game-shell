// src/main.js

import SceneManager from "./core/SceneManager.js";
import GameLoop from "./core/GameLoop.js";
import GameScene from "./scenes/GameScene.js";

// Start with the GameScene
// make window.currentScene available globally 
const scene = new GameScene();
window.currentScene = scene;

// now use the context returned by the scene itself
const ctx = scene.getContext();

SceneManager.changeScene(scene);

// Connect game loop to the active scene
const loop = new GameLoop(
  (dt) => SceneManager.update(dt),
  () => SceneManager.render(ctx)
);

loop.start();
