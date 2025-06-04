// src/systems/EnemySystem.js

import Enemy from "../entities/Enemy.js";
import AssetLoader from "../core/AssetLoader.js";

const GRID_SIZE = 32;

export default class EnemySystem {
  constructor(entitySystem) {
    this.entitySystem = entitySystem;
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

    this.entitySystem.addEnemy(enemy);
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
    for (const enemy of this.entitySystem.getEnemies()) {
      if (enemy.update) enemy.update(deltaTime);
	}
  }
  
  // example of extending enemy system with ai behavior
  // TODO: Branch out into separate modules to keep lean
  // and only have them here for now?
  trackPlayer(deltaTime) {
    const player = this.entitySystem.getPlayer();
    for (const enemy of this.entitySystem.getEnemies()) {
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
