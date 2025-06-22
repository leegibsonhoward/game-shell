// src/systems/MovementSystem.js
export default class MovementSystem {
  constructor(input, entitySystem) {
    this.input = input;
    this.entitySystem = entitySystem;
  }

  update() {
    const { dx, dy } = this.input.getMovementVector();
    const player = this.entitySystem.getPlayer();

    // set dx/dy, even if zero, to ensure they're defined
    player.dx = dx;
    player.dy = dy;

    // 🎞️ Choose animation based on movement
    if (player.animator) {
    if (dx !== 0 || dy !== 0) {
      player.animator.setAnimation("walk");
    } else {
      player.animator.setAnimation("idle");
    }
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
    const player = this.entitySystem.getPlayer();
    player.x += dx;
    player.y += dy;
  }

}
