// src/core/tiles/Tilemap.js

/**
 * Tilemap stores a 2D grid of tile indices, usually loaded from a level file or generated.
 * It represents the layout of a map, where each number corresponds to a tile index in a Tileset.
 */
export default class Tilemap {
  /**
   * @param {number[][]} data - 2D array representing the tile layout (rows × columns).
   * @param {number} tileWidth - Width of each tile in pixels.
   * @param {number} tileHeight - Height of each tile in pixels.
   */
  constructor(data, tileWidth, tileHeight) {
    this.data = data; // 2D array: map[row][col] = tileIndex
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.rows = data.length;
    this.columns = data[0]?.length || 0;
  }

  /**
   * Get the tile index at a given grid coordinate.
   * @param {number} col - The x/grid column.
   * @param {number} row - The y/grid row.
   * @returns {number} - The tile index, or -1 if out of bounds.
   */
  getTile(col, row) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.columns) return -1;
    return this.data[row][col];
  }

  /**
   * Set the tile index at a given grid coordinate.
   * @param {number} col - The x/grid column.
   * @param {number} row - The y/grid row.
   * @param {number} index - The tile index to place.
   */
  setTile(col, row, index) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
      this.data[row][col] = index;
    }
  }
}
