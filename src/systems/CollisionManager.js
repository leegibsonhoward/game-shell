// systems/CollisionManager.js
import { resolvePlayerEnemyCollisions, isHazardAt } from "./CollisionSystem.js";

/**
 * CollisionManager orchestrates all game-specific collision logic.
 * It connects tile-based collision with entity-based AABB detection,
 * and calls into combat or gameplay systems when collisions occur.
 */
export default class CollisionManager {
  /**
   * @param {EntityManager} entityManager - access to player and enemies
   * @param {TileCollisionSystem} tileCollisionSystem - for solid tile blocking
   * @param {CombatSystem} combatSystem - to resolve combat on collision
   */
  constructor(entityManager, tileCollisionSystem, combatSystem, tileManager) {
    this.entityManager = entityManager;
    this.tileCollisionSystem = tileCollisionSystem;
    this.combatSystem = combatSystem;
    this.tileManager = tileManager;
  }

  /**
   * Runs all collision checks:
   * - Prevents player from walking through walls
   * - Detects and handles player vs enemy overlaps
   */
  update() {
    const player = this.entityManager.getPlayer();

    // Prevent player from moving through solid tiles
    this.tileCollisionSystem.applyCollision(player);

    
    // apply movement AFTER tile collision is checked
    player.x += player.dx;
    player.y += player.dy;

    const corners = [
      [player.x, player.y],
      [player.x + player.width, player.y],
      [player.x, player.y + player.height],
      [player.x + player.width, player.y + player.height],
    ];

  for (const [px, py] of corners) {
    if (isHazardAt(this.tileManager, px, py)) {
      player.health -= 1;
      console.log("⚠️ Player stepped on hazard tile! Health:", player.health);
      break;
    }
  }

    
    // Handle player vs enemy AABB collision and apply game logic
    resolvePlayerEnemyCollisions(
      player,
      this.entityManager.enemies,
      (player, enemy, index) => {
        console.log(`💥 Player collided with enemy ${index}`);
        player.health -= 10;
        // disabled to fine tune hitbox precision
        //this.combatSystem.attackEnemy(index);
        //console.log(`Player health: ${player.health}`);
      }
    );
  }
}
