// src/core/Tileset.js

/**
 * Tileset handles slicing and accessing individual tiles from a larger tilesheet image.
 * This class is used by the TileRenderer to draw specific tiles onto the canvas.
 */
export default class Tileset {
  /**
   * @param {HTMLImageElement} image - The loaded tileset image.
   * @param {number} tileWidth - Width of a single tile in pixels.
   * @param {number} tileHeight - Height of a single tile in pixels.
   * @param {number} [spacing=0] - Optional spacing between tiles.
   */
  constructor(image, tileWidth, tileHeight, spacing = 0) {
    this.image = image; // Full tileset image
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.spacing = spacing;

    // Calculate how many columns of tiles fit in the image
    this.columns = Math.floor(image.width / (tileWidth + spacing));
  }

  /**
   * Draw a single tile by its index at a given position on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   * @param {number} tileIndex - The index of the tile to draw.
   * @param {number} x - The destination x position (in pixels).
   * @param {number} y - The destination y position (in pixels).
   * @param {number} [scale=1] - Optional scale multiplier for rendering.
   */
  drawTile(ctx, tileIndex, x, y, scale = 1) {
    // Calculate source X and Y from index
    const sx = (tileIndex % this.columns) * (this.tileWidth + this.spacing);
    const sy = Math.floor(tileIndex / this.columns) * (this.tileHeight + this.spacing);

    // Draw the tile from the tileset to the canvas
    ctx.drawImage(
      this.image,
      sx, sy, this.tileWidth, this.tileHeight, // Source rect in tileset
      x, y, this.tileWidth * scale, this.tileHeight * scale // Destination rect on screen
    );
  }
}
