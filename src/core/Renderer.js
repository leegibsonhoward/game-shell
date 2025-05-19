// src/rendering/Renderer.js
export default class Renderer {
    constructor(ctx, entityManager) {
      this.ctx = ctx;
      this.entityManager = entityManager;
    }
  
    clear() {
      const canvas = this.ctx.canvas;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    render() {
      this.clear();
      const entities = this.entityManager.getAllEntities();
      for (const entity of entities) {
        entity.draw(this.ctx);
      }
    }
  }
  