// src/entities/Enemy.js
import Entity from "./Entity.js";

export default class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 32, 32);
    this.health = 50;
  }

  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }

  update() {
    // Add future enemy behavior here
  }
}
