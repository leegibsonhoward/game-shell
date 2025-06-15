/**
 * A simple 2D camera that follows a target entity within map bounds.
 * Offsets rendering so the target appears centered or tracked.
 */
export default class Camera {
  constructor(viewportWidth, viewportHeight, mapWidth, mapHeight) {
    // Viewport dimensions (visible screen)
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    // Full map dimensions (world size)
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;

    // Current top-left position of the camera
    this.x = 0;
    this.y = 0;
  }

  /**
   * Call this each frame to reposition the camera to follow a target (like player).
   * Ensures target is centered while clamping to map edges.
   */
  follow(target) {
    const centerX = target.x + target.width / 2;
    const centerY = target.y + target.height / 2;

    this.x = centerX - this.viewportWidth / 2;
    this.y = centerY - this.viewportHeight / 2;

    // Clamp to map bounds so camera doesn't go beyond edges
    this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.viewportWidth));
    this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.viewportHeight));
  }

  /**
   * Apply this camera’s translation to the rendering context.
   * Call at the start of GameScene.render(ctx).
   */
  applyTransform(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
  }

  /**
   * Restore original context transform.
   * Call at the end of GameScene.render(ctx).
   */
  resetTransform(ctx) {
    ctx.restore();
  }
}
