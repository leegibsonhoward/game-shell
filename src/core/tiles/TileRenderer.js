// src/core/tiles/TileRenderer.js

/**
 * TileRenderer draws a Tilemap using a Tileset onto the canvas.
 * It loops over the tile grid and delegates tile drawing to the Tileset.
 */
export default class TileRenderer {
  /**
   * @param {Tilemap} tilemap - The tilemap to draw.
   * @param {Tileset} tileset - The tileset used to render tile graphics.
   */
  constructor(tilemap, tileset) {
    this.tilemap = tilemap;
    this.tileset = tileset;
  }

  /**
   * Renders the full tilemap to the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D canvas context.
   */
  render(ctx) {
    for (let row = 0; row < this.tilemap.rows; row++) {
      for (let col = 0; col < this.tilemap.columns; col++) {
        const index = this.tilemap.getTile(col, row);
        if (index >= 0) {
          const x = col * this.tilemap.tileWidth;
          const y = row * this.tilemap.tileHeight;
          this.tileset.drawTile(ctx, index, x, y);
        }
      }
    }
  }
}
