// src/entities/Entity.js
export default class Entity {
    constructor(x, y, width, height, color = 'black') {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.health = 100;
    }
  
    update() {
      // Optional override for behavior
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  