// src/entities/Entity.js

const GRID_SIZE = 32;

export default class Entity {
    constructor(x, y, width, height) {
      this.x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      this.y = Math.round(y / GRID_SIZE) * GRID_SIZE;
      this.dx = 0; // initialize movement delta
      this.dy = 0;
      this.width = width;
      this.height = height;
    //   this.sprite = sprite; // { image, frameWidth, frameHeight }
      this.health = 100;
      this.animationFrame = 0;

      // Optional: custom collision hitbox offset
      this.hitbox = null; // { offsetX, offsetY, width, height }
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
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 1;
    ctx.strokeRect(
    Math.floor(this.x), Math.floor(this.y), this.width, this.height);

    // Draw red hitbox if enabled
    if (window.currentScene?.debugDrawHitboxes && this.hitbox) {
    //console.log(window.currentScene?.debugDrawHitboxes)
    const { offsetX = 0, offsetY = 0, width, height } = this.hitbox;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.floor(this.x + offsetX), Math.floor(this.y + offsetY), width, height);
  }
  }
}
  