// src/core/Tileset.js

/**
 * Tileset handles slicing a tileset image and stores optional collision shapes.
 */
export default class Tileset {
  /**
   * @param {HTMLImageElement} image - The loaded tileset image.
   * @param {number} tileWidth - Width of a single tile in pixels.
   * @param {number} tileHeight - Height of a single tile in pixels.
   * @param {number} [spacing=0] - Optional spacing between tiles.
   * @param {number} [margin=0] - Optional margin between tiles.
   */
  constructor(image, tileWidth, tileHeight, spacing = 0, margin = 0) {
    this.image = image;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.spacing = spacing;
    this.margin = margin;

    this.columns = Math.floor(
      (image.width - margin + spacing) / (tileWidth + spacing)
    );
    this.rows = Math.floor(
      (image.height - margin + spacing) / (tileHeight + spacing)
    );

    /**
     * Indexed by tile ID → array of shapes [{ x, y, width, height } or polygon]
     */
    this.collisionShapes = {};
  }

  /**
   * Load per-tile collision data from a parsed .tsx JSON (Tiled tileset)
   * @param {object} tsxData - Parsed JSON object from a .tsx file
   */
  loadCollisionShapesFromTSX(tsxData) {
    if (!Array.isArray(tsxData.tiles)) return;

  for (const tile of tsxData.tiles) {
    const tileId = tile.id;

    // Tiled stores collision shapes in an 'objectgroup'
    const shapeObjects = tile.objectgroup?.objects;
    if (!Array.isArray(shapeObjects)) continue;

    const shapes = [];

    for (const obj of shapeObjects) {
      if (obj.polygon) {
        // 🔺 Polygon shape
        shapes.push({
          type: "polygon",
          x: obj.x,
          y: obj.y,
          points: obj.polygon, // Array of points relative to shape (and tile)
        });
      } else {
        // 🟥 Rectangle shape (default)
        shapes.push({
          type: "rect",
          x: obj.x,
          y: obj.y,
          width: obj.width,
          height: obj.height,
        });
      }
    }

    if (shapes.length > 0) {
      this.collisionShapes[tileId] = shapes;
    }
  }
  }
  /**
   * Get the collision shape(s) for a tile ID
   * @param {number} tileIndex
   * @returns {Array|undefined}
   */
  getCollisionShapes(tileIndex) {
    return this.collisionShapes[tileIndex];
  }
}
