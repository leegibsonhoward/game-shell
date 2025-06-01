// core/tiles/tileUtils.js

/**
 * Check if a tile exists at a given world-space position in a tile layer.
 * A tile is considered "present" if its index is >= 0.
 * This is used by systems like collision, hazard, and trigger checks.
 *
 * @param {Object} layer - A tile layer object containing grid data
 * @param {number} x - World-space X position (in pixels)
 * @param {number} y - World-space Y position (in pixels)
 * @returns {boolean} true if a tile exists at the given position
 */
export function tileExistsAt(layer, x, y) {
  if (!layer?.data) return false;

  const col = Math.floor(x / layer.tileWidth);
  const row = Math.floor(y / layer.tileHeight);

  const rows = layer.data.length;
  const cols = layer.data[0]?.length ?? 0;

  if (!Number.isFinite(row) || !Number.isFinite(col) || row < 0 || col < 0 || row >= rows || col >= cols) {
    return false;
  }

  return layer.data[row][col] >= 0;
}
