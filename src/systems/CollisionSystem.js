// src/systems/CollisionSystem.js
export function checkAABBCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function resolvePlayerEnemyCollisions(player, enemies, onCollide) {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (checkAABBCollision(player, enemy)) {
      if (onCollide) onCollide(player, enemy, i);
    }
  }
}
