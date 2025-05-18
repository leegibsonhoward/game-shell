// src/entities/Entity.js

const GRID_SIZE = 32;

export default class Entity {
    constructor(x, y, width, height, color = 'black', sprite = null) {
      this.x = Math.round(x / GRID_SIZE) * GRID_SIZE;
    this.y = Math.round(y / GRID_SIZE) * GRID_SIZE;
      this.width = width;
      this.height = height;
      this.color = color;
      this.sprite = sprite; // { image, frameWidth, frameHeight }
      this.health = 100;
      this.animationFrame = 0;
    }
  
    update(deltaTime) {
      // Optional override for behavior
    }
  
    draw(ctx) {
      if (this.sprite && this.sprite.image instanceof HTMLImageElement) {
      const { image, frameWidth, frameHeight } = this.sprite;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        0, 0, frameWidth, frameHeight, // full image for now
        Math.round(this.x), Math.round(this.y), Math.round(this.width), Math.round(this.height)
      );
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    // debug outline of all entities
    ctx.strokeStyle = 'magenta';
    //ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
  