// src/scenes/GameScene.js
import EntityManager from "../core/EntityManager.js";
import EntitySystem from "../systems/EntitySystem.js";
import Renderer from "../core/Renderer.js";
import InputHandler from "../core/InputHandler.js";
import AssetLoader from "../core/AssetLoader.js";
import MovementSystem from "../systems/MovementSystem.js";
import EnemySystem from '../systems/EnemySystem.js';
import CombatSystem from "../systems/CombatSystem.js";
import Tileset from "../core/tiles/Tileset.js";
import TileRenderer from "../core/tiles/TileRenderer.js";
import TileManager from "../core/tiles/TileManager.js";
import { loadTilemapFromJSON } from "../core/tiles/TilemapLoader.js";
import TileCollisionSystem from "../core/systems/TileCollisionSystem.js";
import CollisionManager from "../systems/CollisionManager.js";

export default class GameScene {
  constructor() {
    this.debugDrawHitboxes = false; // Toggle for hitbox debug
    this.showGrid = false;          // Toggle for debug grid
    this.entityManager = new EntityManager();
    this.entitySystem = new EntitySystem(this.entityManager);

    this.input = new InputHandler();
    
    // Gameplay systems
    this.movementSystem = new MovementSystem(this.input, this.entitySystem);
    this.enemySystem = new EnemySystem(this.entitySystem);
    this.combatSystem = new CombatSystem(this.entitySystem);
    
    // Tile-based systems   
    this.tileManager = new TileManager(); // Handles all tilemaps
    this.tileRenderer = null;             // Draws tilemaps
    this.tileset = null;                  // Handles tileset slicing
    this.tileCollisionSystem = null;      // Handles solid tile logic
    this.collisionManager = null; // Coordinates all collision logic

    this.renderer = null;
    this.isLoaded = false;
  }

  async load() {
    // Load tileset image used for drawing the map
    const tilesetImg = await AssetLoader.loadImage("dungeon", "/assets/tilesets/level-tileset.png");
    this.tileset = new Tileset(tilesetImg, 32, 32, 0);
    console.log("Tileset image loaded:", tilesetImg.width, tilesetImg.height);

    // Load tilemap JSON with multiple named layers
    const layers = await loadTilemapFromJSON("/assets/maps/level-map-walls.json", 32, 32);

    // Merge layers into manager for future expansion
    this.tileManager.addLayers(layers);

    // Store raw layers in renderer as fallback
    this.tileRenderer = new TileRenderer(layers, this.tileset);

    console.log("Tileset columns:", this.tileset.columns);
    console.log("Loaded tile layers:", Object.keys(layers));

    // Setup tile collision system using 'collision' layer
    this.tileCollisionSystem = new TileCollisionSystem(this.tileManager);

    // Setup collision manager to coordinate logic
    this.collisionManager = new CollisionManager(
      this.entitySystem,
      this.tileCollisionSystem,
      this.combatSystem,
      this.tileManager
    );

    // Load character sprites
    const playerImg = await AssetLoader.loadImage("player", "/assets/player.png");
    const enemyImg = await AssetLoader.loadImage("enemy", "/assets/enemy.png");
    
    const standardWidth = 32;
    const standardHeight = 32;

    const player = this.entitySystem.getPlayer();
    this.entitySystem.setPlayer(player);

    player.width = standardWidth;
    player.height = standardHeight;
    player.sprite = {
      image: playerImg,
      frameWidth: playerImg.width,
      frameHeight: playerImg.height,
    };

    for (const enemy of this.entitySystem.getEnemies()) {
      enemy.width = standardWidth;
      enemy.height = standardHeight;
      enemy.sprite = {
        image: enemyImg,
        frameWidth: enemyImg.width,
        frameHeight: enemyImg.height,
      };
      this.enemySystem.spawnEnemy(32, 168);
    }



    this.renderer = new Renderer(this.getContext(), this.entityManager);
    this.isLoaded = true;

    // ⌨️ Register key listener to toggle grid with 'G'
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "g") {
        this.showGrid = !this.showGrid;
        console.log(`Grid overlay: ${this.showGrid ? "ON" : "OFF"}`);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "h") {
      this.debugDrawHitboxes = !this.debugDrawHitboxes;
      console.log(`🔲 Hitbox Debug: ${this.debugDrawHitboxes ? "ON" : "OFF"}`);
      }
    });

  }

  getContext() {
    const canvas = document.getElementById("gameCanvas");

    // TODO: refractor to config?

    // Internal resolution for game logic
    const GAME_WIDTH = 320;
    const GAME_HEIGHT = 180;
    const SCALE = 3; // Visual scale factor (960x540 output)

    // Set internal canvas resolution
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    // Visually scale up for display
    canvas.style.width = `${GAME_WIDTH * SCALE}px`;
    canvas.style.height = `${GAME_HEIGHT * SCALE}px`;
    canvas.style.imageRendering = "pixelated";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.boxSizing = "border-box";
    canvas.style.background = "#111";

    // Get rendering context
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    console.log("Canvas initialized:", canvas.width, canvas.height, "scale: " + SCALE + "x");
    
    return ctx;
  }

  update(deltaTime) {
    if (!this.isLoaded) return;

    // Apply movement input
    this.movementSystem.update();

    
    this.collisionManager.update();


    // Update enemy logic
    this.enemySystem.updateAllEnemies(deltaTime);

  }

  render(ctx) {
    if (!this.isLoaded) return;

    // Debug background
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw tile layers (background/ground/foreground)
    if (this.tileRenderer) {
        this.tileRenderer.render(ctx);
    }

    // Conditionally draw debug tile grid (32x32 cells)
    if (this.showGrid) {
      ctx.save();
      ctx.strokeStyle = "rgb(243, 255, 10)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= ctx.canvas.width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= ctx.canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ✅ Draw game entities
    this.renderer.render();

    // ✅ Draw HUD
    const player = this.entitySystem.getPlayer();
    ctx.fillStyle = "#00FF00";
    ctx.font = "bold 12px monospace";
    ctx.fillStyle = "#000";
    ctx.fillRect(5, 5, 100, 40);
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(5, 5, 100, 40);
    ctx.fillStyle = "#00FF00";
    ctx.fillText(`❤ HEALTH: ${player.health}`, 10, 20);
    ctx.fillText(`📍 X:${Math.floor(player.x)} Y:${Math.floor(player.y)}`, 10, 35);

}

  unload() {
    AssetLoader.clear();
    this.tileManager.clear();
  }
}
