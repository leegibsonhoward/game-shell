// src/core/gameLoop.js
export default class GameLoop {
    constructor(updateFn, renderFn) {
      this.updateFn = updateFn;
      this.renderFn = renderFn;
      this.lastTime = 0;
    }
  
    start() {
      requestAnimationFrame(this.loop.bind(this));
    }
  
    loop(currentTime) {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
  
      this.updateFn(deltaTime);
      this.renderFn();
  
      requestAnimationFrame(this.loop.bind(this));
    }
  }
  