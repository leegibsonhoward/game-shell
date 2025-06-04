// systems/EntitySystem.js

import Player from "../entities/Player.js";

/**
 * EntitySystem coordinates game-specific roles like player, enemies, and score.
 * It wraps the core EntityManager and adds gameplay-specific organization.
 */
export default class EntitySystem {
  constructor(entityManager) {
    this.entityManager = entityManager;

    this.player = new Player(50, 50);
    this.enemies = [];
    this.score = 0;
  }

  // Set and track the player entity
  setPlayer(player) {
    this.player = player;
    this.entityManager.addEntity(player);
  }

  getPlayer() {
    return this.player;
  }

  // Manage enemies as a game-level group
  addEnemy(enemy) {
    this.enemies.push(enemy);
    this.entityManager.addEntity(enemy);
  }

  getEnemies() {
    return this.enemies;
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
    }
    this.entityManager.removeEntity(enemy);
  }

  clearEnemies() {
    for (const enemy of this.enemies) {
      this.entityManager.removeEntity(enemy);
    }
    this.enemies.length = 0;
  }

  // Score tracking
  getScore() {
    return this.score;
  }

  addScore(amount) {
    this.score += amount;
  }

  reset() {
    this.player = null;
    this.clearEnemies();
    this.score = 0;
  }
}
