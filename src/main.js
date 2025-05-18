// src/main.js
import EntityManager from "./entities/EntityManager.js";
import Renderer from "./rendering/Renderer.js";
import InputHandler from "./core/inputHandler.js";
import GameLoop from "./core/gameLoop.js";

// Setup canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Init systems
export const entityManager = new EntityManager();
const renderer = new Renderer(ctx, entityManager);
const inputHandler = new InputHandler();

function update(deltaTime) {
  const { dx, dy } = inputHandler.getMovementVector();
  if (dx !== 0 || dy !== 0) {
    entityManager.movePlayer(dx, dy);
  }

  entityManager.updateAll(deltaTime);
}

function render() {
  renderer.render();
}

const loop = new GameLoop(update, render);
loop.start();
