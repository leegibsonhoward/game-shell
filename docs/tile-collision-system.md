// Overview: TileCollisionSystem as a Core Engine Feature

/**
 * In a tile-based game engine, a TileCollisionSystem is typically considered
 * a core system because tile interactions define the structure of the game world.
 * It's not optional in most games that have terrain, walls, or level geometry.
 */

/**
 * Why It Belongs in the Core
 * - Game logic depends on preventing movement through walls or solid tiles.
 * - Most 2D tile-based games (platformers, RPGs, top-down) assume tiles affect movement.
 * - Systems like AI, movement, triggers, and physics often query tile solidity.
 */

/**
 * How It Fits Your Structure:
 *
 * [assets/maps/map1.tmj] → loaded by → TilemapLoader
 *      ↳ returns multiple named layers (e.g., 'background', 'collision')
 *
 * [TileManager] stores these layers
 *      ↳ getLayer('collision') → gives the solid tilemap
 *
 * [TileCollisionSystem] queries the tilemap to block movement
 *      ↳ integrates with MovementSystem or GameScene
 */

/**
 * Typical Integration Flow:
 * 1. GameScene creates TileCollisionSystem(tileManager)
 * 2. MovementSystem asks tileCollisionSystem.isSolidAt(x, y)
 * 3. MovementSystem or entity dx/dy is adjusted accordingly
 */

/**
 * Benefits of Separating This System
 * - Keeps tile collision logic reusable and testable
 * - Keeps MovementSystem clean and focused on input logic
 * - Makes it easy to later switch to slope-based or bitmask collisions
 */

/**
 * Summary:
 * TileCollisionSystem is a core engine component in your design.
 * It works directly with your TileManager, enhances MovementSystem,
 * and ensures that the map structure defines real game logic.
 */
