// src/entities/Entity.js

const GRID_SIZE = 32;

export default class Entity {
    constructor(x, y, width, height, sprite = null) {
      this.x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      this.y = Math.round(y / GRID_SIZE) * GRID_SIZE;
      this.dx = 0; // initialize movement delta
      this.dy = 0;
      this.width = width;
      this.height = height;
      this.sprite = sprite; // { image, frameWidth, frameHeight }
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

    // Use animator if available
    if (this.animator) {
      const frame = this.animator.getCurrentFrame();
      ctx.drawImage(
        image,
        frame.x, frame.y, frame.width, frame.height,   // source frame on sprite sheet
        Math.round(this.x), Math.round(this.y),        // destination on canvas
        Math.round(this.width), Math.round(this.height)
      );
    } else {
      // No animator: draw first frame (default)
      ctx.drawImage(
        image,
        0, 0, frameWidth, frameHeight,
        Math.round(this.x), Math.round(this.y),
        Math.round(this.width), Math.round(this.height)
      );
    }

  } else {
    // Fallback: draw a simple colored box
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // Yellow outline (debug bounding box)
  if (window.currentScene?.debugBoundingBox) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      Math.floor(this.x),
      Math.floor(this.y),
      this.width,
      this.height
    );
  }

  // Red hitbox outline
  if (window.currentScene?.debugDrawHitboxes && this.hitbox) {
    const { offsetX = 0, offsetY = 0, width, height } = this.hitbox;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      Math.floor(this.x + offsetX),
      Math.floor(this.y + offsetY),
      width,
      height
    );
  }
  }
}
  