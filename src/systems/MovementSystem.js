// src/systems/MovementSystem.js
export default class MovementSystem {
  constructor(input, entityManager) {
    this.input = input;
    this.entityManager = entityManager;
  }

  update() {
    const { dx, dy } = this.input.getMovementVector();
    const player = this.entityManager.getPlayer();
    if (dx !== 0 || dy !== 0) {
        player.x += dx;
        player.y += dy;
    }
  }

  manualMovePlayer(dx, dy) {
    const player = this.entityManager.getPlayer();
    player.x += dx;
    player.y += dy;
  }

}
