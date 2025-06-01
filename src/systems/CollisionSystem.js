// src/systems/CollisionSystem.js (renamed purpose)
// This file contains game-specific collision logic
// It uses core AABB utilities for overlap detection

import { checkAABBCollision } from "../core/collision/AABB.js";

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
    }
  }
}
