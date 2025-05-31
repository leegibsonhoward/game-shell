// core/tiles/TilemapLoader.js
import Tilemap from "./Tilemap.js";

/**
 * Loads multiple tile layers from a Tiled JSON (.tmj) map.
 * @param {string} jsonPath - Path to .tmj file
 * @param {number} tileWidth - Width of each tile in px
 * @param {number} tileHeight - Height of each tile in px
 * @returns {Promise<Object>} - A map of layerName → Tilemap instance
 */
export async function loadTilemapFromJSON(jsonPath, tileWidth, tileHeight) {
  const mapData = await (await fetch(jsonPath)).json();

  const columns = mapData.width;
  const rows = mapData.height;
  const layers = {};

  for (const layer of mapData.layers) {
    if (layer.type !== "tilelayer") continue;
    if (!Array.isArray(layer.data)) {
      console.warn(`Skipping layer '${layer.name}' - missing data array.`);
      continue;
    }

    // Build 2D grid from flat 1D array
    const tileGrid = [];
    for (let row = 0; row < rows; row++) {
      tileGrid[row] = [];
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const rawID = layer.data[index];
        tileGrid[row][col] = (typeof rawID === "number" ? rawID - 1 : -1);
      }
    }

    // 🧪 Debug row lengths
    const rowLengths = tileGrid.map(r => r.length);
    console.log(`Grid row lengths for '${layer.name}':`, rowLengths);

    // 🛠 Pad rows if any are shorter than expected
    for (let r = 0; r < rows; r++) {
      while (tileGrid[r].length < columns) {
        tileGrid[r].push(-1);
      }
    }

    // ✅ Save tilemap layer
    console.log(`Loaded tile layer '${layer.name}' (${rows}x${columns})`);
    layers[layer.name] = new Tilemap(tileGrid, tileWidth, tileHeight);
  }

  return layers;
}
