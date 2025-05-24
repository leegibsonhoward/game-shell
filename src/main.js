// src/main.js

import SceneManager from "./core/SceneManager.js";
import GameLoop from "./core/gameLoop.js";
import GameScene from "./scenes/GameScene.js";

// Setup canvas
const canvas = document.getElementById("gameCanvas");
 // Define logical resolution
  const width = 640;
  const height = 480;
  const scale = 1;

  // Set canvas resolution
  canvas.width = width;
  canvas.height = height;

  // Set displayed (CSS) size
  canvas.style.width = `${width * scale}px`;
  canvas.style.height = `${height * scale}px`;

const ctx = canvas.getContext("2d");

// Start with the GameScene
// make window.currentScene available to all your
// console commands that reference scene systems
window.currentScene = new GameScene()
SceneManager.changeScene(window.currentScene);

// Connect game loop to the active scene
const loop = new GameLoop(
  (dt) => SceneManager.update(dt),
  () => SceneManager.render(ctx)
);

loop.start();
