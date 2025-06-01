// systems/CollisionManager.js
import { resolvePlayerEnemyCollisions } from "./CollisionSystem.js";

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
  constructor(entityManager, tileCollisionSystem, combatSystem) {
    this.entityManager = entityManager;
    this.tileCollisionSystem = tileCollisionSystem;
    this.combatSystem = combatSystem;
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

    // Handle player vs enemy AABB collision and apply game logic
    resolvePlayerEnemyCollisions(
      player,
      this.entityManager.enemies,
      (player, enemy, index) => {
        console.log(`💥 Player collided with enemy ${index}`);
        player.health -= 10;
        this.combatSystem.attackEnemy(index);
        console.log(`Player health: ${player.health}`);
      }
    );
  }
}
