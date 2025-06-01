// src/systems/MovementSystem.js
export default class MovementSystem {
  constructor(input, entityManager) {
    this.input = input;
    this.entityManager = entityManager;
  }

  update() {
    const { dx, dy } = this.input.getMovementVector();
    const player = this.entityManager.getPlayer();

    // set dx/dy, even if zero, to ensure they're defined
    player.dx = dx;
    player.dy = dy;
    
    if (dx !== 0 || dy !== 0) {
        player.x += dx;
        player.y += dy;
    }
  }

  /**
   * Teleports the player instantly without triggering movement-based systems.
   * - Does NOT set dx/dy, so tile collision and animations are unaffected.
   * - Use for console commands, dev tools, or scripted transitions.
   *
   * For simulated movement with collision/animation, consider adding
   * a separate method that sets dx/dy and lets systems process it.
   */
    teleportPlayer(dx, dy) {
    const player = this.entityManager.getPlayer();
    player.x += dx;
    player.y += dy;
  }

}
