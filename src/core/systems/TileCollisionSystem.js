// core/systems/TileCollisionSystem.js

import { checkAABBCollision } from "../collision/AABB.js";
import { getHitboxCorners } from "../collision/getHitboxCorners.js";
import { getHitbox } from "../collision/getHitbox.js";
import { aabbIntersectsPolygon } from "../collision/SAT.js";

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
  const ctx = window.currentScene?.debugPolyHitbox ? window.currentScene?.ctx : null;


  const shapes = this.tileset.getCollisionShapes(tileIndex);
    //if (!shapes || shapes.length === 0) return false;
    // Fallback: treat tile as solid if it has no shapes
    if (!shapes || shapes.length === 0) {
      return true;
    }

  // core/collision/getHitbox.js
  const entityBox = getHitbox(entity);

  for (const shape of shapes) {
    if (Array.isArray(shape.points)) {
        // 🔺 Use SAT-based AABB-vs-Polygon intersection
        const worldPoly = shape.points.map(p => ({
          x: col * layer.tileWidth + shape.x + p.x,
          y: row * layer.tileHeight + shape.y + p.y,
        }));

         if (ctx) {
  ctx.beginPath();
  ctx.moveTo(worldPoly[0].x, worldPoly[0].y);
  for (let i = 1; i < worldPoly.length; i++) {
    ctx.lineTo(worldPoly[i].x, worldPoly[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 0.5;
  ctx.stroke();
}
        if (aabbIntersectsPolygon(entityBox, worldPoly)) {
          console.log("🔺 SAT POLYGON COLLISION with tile shape:", worldPoly);
          return true;
        }

      } else {
        // 🟥 Rectangle shape fallback (AABB vs AABB)
        const shapeBox = {
          x: col * layer.tileWidth + shape.x,
          y: row * layer.tileHeight + shape.y,
          width: shape.width,
          height: shape.height,
        };

        if (checkAABBCollision(entityBox, shapeBox)) {
          console.log("🟥 RECT COLLISION with tile shape:", shapeBox);
          return true;
        }
      }
  }

  return false;
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
  for (const [px, py] of getHitboxCorners(entity)) {
    if (this.isSolidAt(px, py, entity)) {
      xBlocked = true;
      break;
    }
  }

  // --- Check Y movement only ---
  entity.x = originalX;
  entity.y = originalY + entity.dy;
  let yBlocked = false;
  for (const [px, py] of getHitboxCorners(entity)) {
    if (this.isSolidAt(px, py, entity)) {
      yBlocked = true;
      break;
    }
  }

  // --- Restore original position ---
  entity.x = originalX;
  entity.y = originalY;

  // Cancel blocked movement
  if (xBlocked) entity.dx = 0;
  if (yBlocked) entity.dy = 0;
}

  }

