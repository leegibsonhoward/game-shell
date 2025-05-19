// src/scenes/GameScene.js
import EntityManager from "../entities/EntityManager.js";
import Renderer from "../rendering/Renderer.js";
import InputHandler from "../core/InputHandler.js";
import AssetLoader from "../core/AssetLoader.js";
import { resolvePlayerEnemyCollisions } from "../systems/CollisionSystem.js";

export default class GameScene {
  constructor() {
    this.entityManager = new EntityManager();
    this.input = new InputHandler();
    this.renderer = null;
    this.isLoaded = false;
  }

  async load() {
    const playerImg = await AssetLoader.loadImage("player", "/assets/player.png");
    const enemyImg = await AssetLoader.loadImage("enemy", "/assets/enemy.png");
    
    const standardWidth = 32;
    const standardHeight = 32;

    const player = this.entityManager.getPlayer();
    player.width = standardWidth;
    player.height = standardHeight;
    player.sprite = {
      image: playerImg,
      frameWidth: playerImg.width,
      frameHeight: playerImg.height,
    };

    for (const enemy of this.entityManager.enemies) {
      enemy.width = standardWidth;
      enemy.height = standardHeight;
      enemy.sprite = {
        image: enemyImg,
        frameWidth: enemyImg.width,
        frameHeight: enemyImg.height,
      };
    }

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

    // basic collision handling
    resolvePlayerEnemyCollisions(
      this.entityManager.getPlayer(),
      this.entityManager.enemies,
      (player, enemy, index) => {
        console.log(`💥 Player collided with enemy ${index}`);
        player.health -= 10;
        this.entityManager.enemies.splice(index, 1);
        this.entityManager.score += 10;
        console.log(`Player health: ${player.health}`);
      }
    );
  
  }

  render(ctx) {
    if (!this.isLoaded) return;
    this.renderer.render();

     // display player health and position
    const player = this.entityManager.getPlayer();
    ctx.fillStyle = "#00FF00";
    ctx.font = "bold 14px 'Share Tech Mono', monospace";
    ctx.fillText(`❤ HEALTH: ${player.health}`, 10, 20);
    ctx.fillText(`📍 X:${Math.floor(player.x)} Y:${Math.floor(player.y)}`, 10, 40);

  }

  unload() {
    AssetLoader.clear();
  }
}
