// core/tiles/TilemapLoader.js
import Tilemap from "./Tilemap.js";

/**
 * Loads a Tiled JSON map and converts the first tile layer into a Tilemap instance.
 * @param {string} jsonPath - Path to the .json tilemap file
 * @param {number} tileWidth - Width of each tile in pixels
 * @param {number} tileHeight - Height of each tile in pixels
 * @returns {Promise<Tilemap>} - A populated Tilemap instance
 */
export async function loadTilemapFromJSON(jsonPath, tileWidth, tileHeight) {
  const mapData = await (await fetch(jsonPath)).json();

  // Assumes the first tile layer is a valid tilelayer
  const layer = mapData.layers.find(l => l.type === "tilelayer");
  const columns = mapData.width;
  const rows = mapData.height;

  const tileGrid = [];
  for (let row = 0; row < rows; row++) {
    tileGrid[row] = [];
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      tileGrid[row][col] = layer.data[index] - 1; // Tiled uses 1-based indexing
    }
  }

  return new Tilemap(tileGrid, tileWidth, tileHeight);
}
