// src/systems/EnemySystem.js
export default class EnemySystem {
  constructor(entityManager) {
    this.entityManager = entityManager;
  }

  moveEnemy(index, dx, dy) {
    const enemy = this.entityManager.getEnemies()[index];
    if (enemy) {
      enemy.x += dx;
      enemy.y += dy;
    }
  }

  updateAllEnemies(deltaTime) {
    for (const enemy of this.entityManager.getEnemies()) {
      if (enemy.update) enemy.update(deltaTime);
    }
  }
}
