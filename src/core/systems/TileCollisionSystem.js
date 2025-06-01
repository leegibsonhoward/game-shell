// core/systems/TileCollisionSystem.js

import { tileExistsAt } from "../tiles/tileUtils.js";

export default class TileCollisionSystem {
  constructor(tileManager) {
    /**
     * The TileManager gives access to named tile layers, especially 'collision'
     */
    this.tileManager = tileManager;

    /**
     * You may optionally set which layer to treat as solid
     */
    this.collisionLayerName = "collision";
  }

   /**
   * Check if a world-space position is colliding with a solid tile
   * Uses the shared tileExistsAt() utility for safe lookup.
   * @param {number} x - World-space x position in pixels
   * @param {number} y - World-space y position in pixels
   * @returns {boolean}
   */
  isSolidAt(x, y) {
    const layer = this.tileManager.getLayer(this.collisionLayerName);
    return tileExistsAt(layer, x, y);
  }

  /**
   * Prevent entity movement if destination is solid
   * @param {object} entity - Must have x, y, width, height, and dx, dy
   */
  applyCollision(entity) {
    const nextX = entity.x + entity.dx;
    const nextY = entity.y + entity.dy;

    // Check 4 corners
    const corners = [
      [nextX, nextY],
      [nextX + entity.width, nextY],
      [nextX, nextY + entity.height],
      [nextX + entity.width, nextY + entity.height],
    ];

    for (const [px, py] of corners) {
      if (this.isSolidAt(px, py)) {
        console.log("🟥 BLOCKED at", px, py);
        entity.dx = 0;
        entity.dy = 0;
        return;
      }
    }
  }
}
