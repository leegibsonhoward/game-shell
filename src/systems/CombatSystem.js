// src/systems/CombatSystem.js
export default class CombatSystem {
  constructor(entityManager) {
    this.entityManager = entityManager;
  }

  attackEnemy(index, damage = 10) {
    const enemies = this.entityManager.getEnemies();
    const enemy = enemies[index];

    if (!enemy) return "not found";

    const defeated = enemy.takeDamage ? enemy.takeDamage(damage) : (enemy.health -= damage) <= 0;
    if (defeated) {
      enemies.splice(index, 1);
      this.entityManager.score += 10;
      return "defeated";
    }

    return `damaged (${enemy.health} HP left)`;
  }
}
