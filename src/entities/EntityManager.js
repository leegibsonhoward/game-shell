// src/entities/EntityManager.js
import Player from "./Player.js";
import Enemy from "./Enemy.js";

export default class EntityManager {
  constructor() {
    this.player = new Player(50, 50);
    this.enemies = [];
    this.score = 0;
  }

  spawnEnemy(x, y, sprite = null) {
    const enemy = new Enemy(x, y);
    if (sprite) enemy.sprite = sprite;
    this.enemies.push(enemy);
  }

  movePlayer(dx, dy) {
    this.player.move(dx, dy);
  }

  moveEnemy(index, dx, dy) {
    const enemy = this.enemies[index];
    if (enemy) {
      enemy.x += dx;
      enemy.y += dy;
    }
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

  getScore() {
    return this.score;
  }
}
