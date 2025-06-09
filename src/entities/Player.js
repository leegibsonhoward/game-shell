// src/entities/Player.js
import Entity from "../core/Entity.js";

export default class Player extends Entity {
  constructor(x, y) {
    super(x, y, 32, 32);
    this.hitbox = {
        offsetX: 6,
        offsetY: 6,
        width: 20,
        height: 26
    };
    this.inventory = [];
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  update() {
    // Add future player logic here
  }
}
