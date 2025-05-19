// src/scenes/GameScene.js
import EntityManager from "../entities/EntityManager.js";
import Renderer from "../core/Renderer.js";
import InputHandler from "../core/InputHandler.js";
import AssetLoader from "../core/AssetLoader.js";
import { resolvePlayerEnemyCollisions } from "../systems/CollisionSystem.js";
import MovementSystem from "../systems/MovementSystem.js";
import EnemySystem from '../systems/EnemySystem.js';

export default class GameScene {
  constructor() {
    this.entityManager = new EntityManager();
    this.input = new InputHandler();
    this.movementSystem = new MovementSystem(this.input, this.entityManager);
    this.enemySystem = new EnemySystem(this.entityManager);
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

    this.movementSystem.update();
    this.enemySystem.updateAllEnemies(deltaTime);

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

    // HUD background box
    ctx.fillStyle ='rgba(0, 0, 0, .5)';
    ctx.fillRect(10, 10, 120, 45);
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 120, 45);

     // display player health and position
    const player = this.entityManager.getPlayer();
    ctx.fillStyle ='#4e9ff4';
    ctx.font = "bold 14px monospace";
    ctx.fillText(`❤ HEALTH: ${player.health}`, 15, 25);
    ctx.fillText(`📍 X:${Math.floor(player.x)} Y:${Math.floor(player.y)}`, 15, 45);

  }

  unload() {
    AssetLoader.clear();
  }
}
