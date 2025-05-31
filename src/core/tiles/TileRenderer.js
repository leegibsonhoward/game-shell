// core/tiles/TileRenderer.js
export default class TileRenderer {
  constructor(tilemapLayers, tileset) {
    /**
     * @param {Object} tilemapLayers - Map of layerName → Tilemap instance
     * @param {Tileset} tileset - Reference to tileset used for rendering
     */
    this.layers = tilemapLayers;
    this.tileset = tileset;
  }

  /**
   * Renders tile layers in draw order: background → ground → foreground
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    const drawOrder = ["background", "ground", "foreground"];

    // Add this inside the render method before the drawOrder loop
console.log("TileRenderer: available layers:", this.layers);
console.log("TileRenderer: drawing layers:", drawOrder);

    for (const name of drawOrder) {
      const map = this.layers[name];
      if (!(map && map.data && Array.isArray(map.data))) {
        console.warn(`Skipping ${name} - map or grid invalid`);
        continue;
      }

      const rows = map.data.length;
      const cols = map.data[0].length;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const tileIndex = map.data[row][col];
          if (tileIndex < 0) continue;

          const tilesPerRow = this.tileset.columns;
          const sx = (tileIndex % tilesPerRow) * this.tileset.tileWidth;
          const sy = Math.floor(tileIndex / tilesPerRow) * this.tileset.tileHeight;
          const dx = col * this.tileset.tileWidth;
          const dy = row * this.tileset.tileHeight;

          console.log(`Rendering '${name}' tile ${tileIndex} at (${col}, ${row}) → sx:${sx} sy:${sy} dx:${dx} dy:${dy}`);

          ctx.drawImage(
            this.tileset.image,
            sx, sy,
            this.tileset.tileWidth,
            this.tileset.tileHeight,
            dx, dy,
            this.tileset.tileWidth,
            this.tileset.tileHeight
          );
        }
      }
    }
  }
}
