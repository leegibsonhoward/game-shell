// src/main.js

import SceneManager from "./core/SceneManager.js";
import GameLoop from "./core/gameLoop.js";
import GameScene from "./scenes/GameScene.js";

// Setup canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Start with the GameScene
SceneManager.changeScene(new GameScene());

// Connect game loop to the active scene
const loop = new GameLoop(
  (dt) => SceneManager.update(dt),
  () => SceneManager.render(ctx)
);

loop.start();
