// src/entities/Enemy.js
import Entity from "./Entity.js";

export default class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 32, 32);
    this.health = 50;
    this.hitbox = {
        offsetX: 6,
        offsetY: 7,
        width: 20,
        height: 23
    };
  }

  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }

  update() {
    // Add future enemy behavior here
  }
}
