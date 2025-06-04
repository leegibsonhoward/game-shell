// src/core/InputHandler.js
export default class InputHandler {
    constructor() {
      this.keys = {};
  
      window.addEventListener("keydown", (e) => {
        const active = document.activeElement;
        const isTyping =
          active &&
          (active.tagName === "INPUT" ||
           active.isContentEditable ||
           active.id === "jconsole-output");
  
        const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        if (arrowKeys.includes(e.key) && isTyping) return;
  
        this.keys[e.key] = true;
      });
  
      window.addEventListener("keyup", (e) => {
        delete this.keys[e.key];
      });
    }
  
    isPressed(key) {
      return this.keys[key];
    }
  
    getMovementVector() {
      let dx = 0,
          dy = 0;
      if (this.isPressed("ArrowUp")) dy -= 1;
      if (this.isPressed("ArrowDown")) dy += 1;
      if (this.isPressed("ArrowLeft")) dx -= 1;
      if (this.isPressed("ArrowRight")) dx += 1;
  
      if (dx !== 0 || dy !== 0) {
        const length = Math.hypot(dx, dy);
        const speed = 2;
        return {
          dx: (dx / length) * speed,
          dy: (dy / length) * speed,
        };
      }
  
      return { dx: 0, dy: 0 };
    }
  }
  