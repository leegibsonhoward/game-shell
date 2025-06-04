// src/systems/CollisionSystem.js (renamed purpose)
import { checkAABBCollision } from "../core/collision/AABB.js";
import { tileExistsAt } from "../core/tiles/tileUtils.js";

/**
 * Game-level utility function to resolve player ↔ enemy collisions.
 * This logic should remain outside the core engine since it assumes
 * specific game rules like "player" and "enemy" roles.
 */
export function resolvePlayerEnemyCollisions(player, enemies, onCollide) {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (checkAABBCollision(player, enemy)) {
      if (onCollide) onCollide(player, enemy, i);
    } //else console.log(`💥 Player not colliding with enemy.`);
  }
}

/**
 * Check if a tile at (x, y) exists in the 'hazard' layer
 * Used to determine if the player stepped on a damaging tile
 */
export function isHazardAt(tileManager, x, y) {
  const hazardLayer = tileManager.getLayer("hazard");
  return tileExistsAt(hazardLayer, x, y);
}

/**
 * Check if a tile at (x, y) exists in the 'interactive' layer
 * Used to trigger events or actions based on map tiles
 */
export function isInteractiveAt(tileManager, x, y) {
  const interactiveLayer = tileManager.getLayer("interactive");
  return tileExistsAt(interactiveLayer, x, y);
}
