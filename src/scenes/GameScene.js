// src/scenes/GameScene.js
import EntityManager from "../entities/EntityManager.js";
import Renderer from "../rendering/Renderer.js";
import InputHandler from "../core/InputHandler.js";
import AssetLoader from "../core/AssetLoader.js";

export default class GameScene {
  constructor() {
    this.entityManager = new EntityManager();
    this.input = new InputHandler();
    this.renderer = null;
    this.isLoaded = false;
  }

  async load() {
    await AssetLoader.loadImage("player", "/assets/player.png");
    await AssetLoader.loadImage("enemy", "/assets/enemy.png");
    this.renderer = new Renderer(this.getContext(), this.entityManager);
    this.isLoaded = true;
  }

  getContext() {
    const canvas = document.getElementById("gameCanvas");
    return canvas.getContext("2d");
  }

  update(deltaTime) {
    if (!this.isLoaded) return;
    const { dx, dy } = this.input.getMovementVector();
    if (dx !== 0 || dy !== 0) {
      this.entityManager.movePlayer(dx, dy);
    }
    this.entityManager.updateAll(deltaTime);
  }

  render(ctx) {
    if (!this.isLoaded) return;
    this.renderer.render();
  }

  unload() {
    AssetLoader.clear();
  }
}
