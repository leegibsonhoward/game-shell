// core/systems/TileCollisionSystem.js

import { checkAABBCollision } from "../collision/AABB.js";

export default class TileCollisionSystem {
  constructor(tileManager, tileset) {
    /**
     * The TileManager gives access to named tile layers, especially 'collision'
     */
    this.tileManager = tileManager;

    /**
     * The tileset
     */
    this.tileset = tileset;

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
  isSolidAt(x, y, entity) {
    const layer = this.tileManager.getLayer(this.collisionLayerName);
    return this._checkCollisionShapeAt(layer, x, y, entity);
  }

  _checkCollisionShapeAt(layer, x, y, entity) {
  if (!layer || !layer.data || !this.tileset) return false;

  const col = Math.floor(x / layer.tileWidth);
  const row = Math.floor(y / layer.tileHeight);

  if (
    !Number.isFinite(row) || !Number.isFinite(col) ||
    row < 0 || col < 0 ||
    row >= layer.data.length || col >= layer.data[0].length
  ) return false;

  const tileIndex = layer.data[row][col];
  if (tileIndex < 0) return false;

  const shapes = this.tileset.getCollisionShapes(tileIndex);
  if (!shapes || shapes.length === 0) return false;

  const entityBox = entity.hitbox
    ? {
        x: entity.x + entity.hitbox.offsetX,
        y: entity.y + entity.hitbox.offsetY,
        width: entity.hitbox.width,
        height: entity.hitbox.height,
      }
    : {
        x: entity.x,
        y: entity.y,
        width: entity.width,
        height: entity.height,
      };

  for (const shape of shapes) {
    const shapeBox = {
      x: col * layer.tileWidth + shape.x,
      y: row * layer.tileHeight + shape.y,
      width: shape.width,
      height: shape.height,
    };
    // Direct rectangle collision check
    if (checkAABBCollision(entityBox, shapeBox)) {
      console.log("🟥 COLLISION with tile shape:", shapeBox);
      return true;
    }
  }

  return false;
}

_getCorners(entity) {
  return [
    [entity.x, entity.y],
    [entity.x + entity.width, entity.y],
    [entity.x, entity.y + entity.height],
    [entity.x + entity.width, entity.y + entity.height],
  ];
}


  /**
   * Prevent entity movement if destination is solid
   * @param {object} entity - Must have x, y, width, height, and dx, dy
   */
  applyCollision(entity) {
    const originalX = entity.x;
    const originalY = entity.y;

    // --- Check X movement only ---
    entity.x = originalX + entity.dx;
    entity.y = originalY;
    let xBlocked = false;
    for (const [px, py] of this._getCorners(entity)) {
        if (this.isSolidAt(px, py, entity)) {
            xBlocked = true;
            break;
        }
  }

  // --- Check Y movement only ---
  entity.x = originalX;
  entity.y = originalY + entity.dy;
  let yBlocked = false;
  for (const [px, py] of this._getCorners(entity)) {
    if (this.isSolidAt(px, py, entity)) {
      yBlocked = true;
      break;
    }
  }

  // --- Restore original position ---
  entity.x = originalX;
  entity.y = originalY;

  // --- Apply only if not blocked ---
  if (xBlocked) entity.dx = 0;
  if (yBlocked) entity.dy = 0;
  }
}
