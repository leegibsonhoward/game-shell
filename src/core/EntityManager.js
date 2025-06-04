// core/EntityManager.js

/**
 * EntityManager is a core engine class for managing a list of active entities.
 * It does not know anything about game-specific logic (like 'player' or 'enemies').
 */
export default class EntityManager {
  constructor() {
    this.entities = [];
  }

  /** Add a new entity to the game world */
  addEntity(entity) {
    this.entities.push(entity);
  }

  /** Remove an entity */
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }

  /** Get all entities (player, enemies, etc.) */
  getAllEntities() {
    return this.entities;
  }

  /** Clear all entities */
  clear() {
    this.entities.length = 0;
  }
}
