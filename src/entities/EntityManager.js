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

  attackEnemy(index) {
    const enemy = this.enemies[index];
    if (enemy) {
      const defeated = enemy.takeDamage(10);
      if (defeated) {
        this.enemies.splice(index, 1);
        this.score += 10;
        return "defeated";
      } else {
        return `damaged (${enemy.health} HP left)`;
      }
    }
    return "not found";
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
