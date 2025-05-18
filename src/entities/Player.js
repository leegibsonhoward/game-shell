// src/entities/Player.js
import Entity from "./Entity.js";

export default class Player extends Entity {
  constructor(x, y) {
    super(x, y, 30, 30, "green");
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
