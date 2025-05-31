// src/core/tiles/TileManager.js

/**
 * TileManager is responsible for managing one or more tilemaps in a scene.
 * It provides access to maps by name or layer and handles basic operations like adding, removing, and retrieving maps.
 * This is the organizational layer that feeds data to renderers and systems.
 */
export default class TileManager {
  constructor() {
    /**
     * Map of layer name → Tilemap
     * These layers are loaded from a single .tmj Tiled JSON file.
     * Each layer (e.g., background, ground, collision) is parsed separately
     * and stored here for easy access by other systems.
     */
    this.maps = {}; // { background: Tilemap, ground: Tilemap, ... }
  }

  /**
   * Add an entire set of named layers at once
   * Typically used after loading a .tmj file with multiple tile layers.
   * @param {Object} layerMap - Map of layerName → Tilemap
   */
  addLayers(layerMap) {
    this.maps = { ...this.maps, ...layerMap };
  }

  /**
   * Add an individual tile layer.
   * Currently unused, but supports dynamic or procedural layer creation.
   * Useful if loading maps from multiple sources or editing layers on-the-fly.
   * @param {string} name - Layer name
   * @param {Tilemap} map - Tilemap instance
   */
  addMap(name, map) {
    this.maps[name] = map;
  }

  /**
   * Retrieve a specific layer by name (e.g., 'collision')
   * Used by systems like rendering or tile collision lookup.
   * @param {string} name
   * @returns {Tilemap | undefined}
   */
  getLayer(name) {
    return this.maps[name];
  }

  /**
   * Alias for getLayer(name)
   * Reserved for semantic flexibility (e.g., when treating maps as logical zones)
   * @param {string} name
   * @returns {Tilemap | undefined}
   */
  getMap(name) {
    return this.getLayer(name);
  }

  /**
   * Return all currently loaded tilemaps as a flat object
   * Useful for debugging, serialization, or layer-wide operations
   * @returns {Object<string, Tilemap>}
   */
  getAllMaps() {
    return this.maps;
  }

  /**
   * Remove a specific tilemap layer
   * Useful for unloading or swapping a single layer at runtime.
   * Currently unused but prepared for dynamic map control.
   * @param {string} name
   */
  removeMap(name) {
    delete this.maps[name];
  }

  /**
   * Clear all loaded layers (full map reset)
   */
  clear() {
    this.maps = {};
  }
}
