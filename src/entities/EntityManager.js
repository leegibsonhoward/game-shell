// src/entities/EntityManager.js
import Player from "./Player.js";
import Enemy from "./Enemy.js";
import AssetLoader from "../core/AssetLoader.js";

const GRID_SIZE = 32;

export default class EntityManager {
  constructor() {
    this.player = new Player(50, 50);
    this.enemies = [];
    this.score = 0;
  }

  spawnEnemy(x, y, sprite = null) {
    const enemy = new Enemy(
        Math.round(x / GRID_SIZE) * GRID_SIZE,
        Math.round(y / GRID_SIZE) * GRID_SIZE
    );
    const enemyImage = AssetLoader.get("enemy");
    if (enemyImage) {
        enemy.sprite = {
        image: enemyImage,
        frameWidth: enemyImage.width,
        frameHeight: enemyImage.height,
        };
    }

    this.enemies.push(enemy);
  }

  updateAll(deltaTime) {
    this.player.update(deltaTime);
    this.enemies.forEach(e => e.update(deltaTime));
  }

  getAllEntities() {
    return [this.player, ...this.enemies];
  }

  getPlayer() {
    return this.player;
  }

  getEnemies() {
    return this.enemies;
  }

  getScore() {
    return this.score;
  }
}
