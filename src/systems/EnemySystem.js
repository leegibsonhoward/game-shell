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
	// enemy tracking player is disabled for now to
	// keep engine capabilities flexible
    // this.trackPlayer();
    for (const enemy of this.entityManager.getEnemies()) {
      if (enemy.update) enemy.update(deltaTime);
	}
  }
  
  // example of extending enemy system with ai behavior
  // TODO: Branch out into separate modules to keep lean
  // and only have them here for now?
  trackPlayer(deltaTime) {
    const player = this.entityManager.getPlayer();
    for (const enemy of this.entityManager.getEnemies()) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const dist = Math.hypot(dx, dy);

      const speed = 1;
      if (dist > 0) {
        enemy.x += (dx / dist) * speed;
        enemy.y += (dy / dist) * speed;
      }
    }
	}

}
