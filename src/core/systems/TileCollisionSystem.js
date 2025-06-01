// core/systems/TileCollisionSystem.js
export default class TileCollisionSystem {
  constructor(tileManager) {
    /**
     * The TileManager gives access to named tile layers, especially 'collision'
     */
    this.tileManager = tileManager;

    /**
     * You may optionally set which layer to treat as solid
     */
    this.collisionLayerName = "ground";
  }

  /**
   * Check if a world-space position is colliding with a solid tile
   * @param {number} x - World-space x position in pixels
   * @param {number} y - World-space y position in pixels
   * @returns {boolean}
   */
  isSolidAt(x, y) {
    const layer = this.tileManager.getLayer(this.collisionLayerName);
    if (!layer || !layer.data || !Array.isArray(layer.data)) return false;

    const col = Math.floor(x / layer.tileWidth);
    const row = Math.floor(y / layer.tileHeight);

    // Out of bounds check
    //if (row < 0 || col < 0 || row >= layer.data.length || col >= layer.data[0].length) return false;

    const rows = layer.data.length;
    const cols = layer.data[0]?.length ?? 0;

    // Out-of-bounds guard
    if (
    !Number.isFinite(row) || !Number.isFinite(col) ||   // Ensure valid numbers
    row < 0 || col < 0 ||
    row >= rows || col >= cols
    ) {
        console.warn(`TileCollisionSystem: invalid row/col → row: ${row}, col: ${col}, x: ${x}, y: ${y}`);
        return false;
    }

  const tileIndex = layer.data[row][col];
  return typeof tileIndex === "number" && tileIndex >= 0;
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
        entity.dx = 0;
        entity.dy = 0;
        return;
      }
    }
  }
}
