// src/core/tiles/TileManager.js

/**
 * TileManager is responsible for managing one or more tilemaps in a scene.
 * It provides access to maps by name or layer and handles basic operations like adding, removing, and retrieving maps.
 * This is the organizational layer that feeds data to renderers and systems.
 */
export default class TileManager {
  constructor() {
    // Stores maps by name or identifier (e.g. "ground", "background", etc.)
    this.maps = new Map();
  }

  /**
   * Adds a tilemap under a given key.
   * @param {string} name - A unique name or layer identifier for this map.
   * @param {Tilemap} tilemap - The tilemap to store.
   */
  addMap(name, tilemap) {
    this.maps.set(name, tilemap);
  }

  /**
   * Retrieves a tilemap by name.
   * @param {string} name - The name used to store the map.
   * @returns {Tilemap|null} - The tilemap or null if not found.
   */
  getMap(name) {
    return this.maps.get(name) || null;
  }

  /**
   * Removes a map by name.
   * @param {string} name - The key used to store the map.
   */
  removeMap(name) {
    this.maps.delete(name);
  }

  /**
   * Returns all tilemaps in insertion order.
   * Useful for rendering multiple layers in correct order.
   * @returns {Iterable<Tilemap>}
   */
  getAllMaps() {
    return this.maps.values();
  }

  /**
   * Clears all stored tilemaps.
   */
  clear() {
    this.maps.clear();
  }
}
