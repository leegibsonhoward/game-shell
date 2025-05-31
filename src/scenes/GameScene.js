// src/scenes/GameScene.js
import EntityManager from "../entities/EntityManager.js";
import Renderer from "../core/Renderer.js";
import InputHandler from "../core/InputHandler.js";
import AssetLoader from "../core/AssetLoader.js";
import { resolvePlayerEnemyCollisions } from "../systems/CollisionSystem.js";
import MovementSystem from "../systems/MovementSystem.js";
import EnemySystem from '../systems/EnemySystem.js';
import CombatSystem from "../systems/CombatSystem.js";
import Tileset from "../core/tiles/Tileset.js";
import TileRenderer from "../core/tiles/TileRenderer.js";
import TileManager from "../core/tiles/TileManager.js";
import { loadTilemapFromJSON } from "../core/tiles/TilemapLoader.js";

export default class GameScene {
  constructor() {
    this.showGrid = false; // Toggle for debug grid
    this.entityManager = new EntityManager();
    this.input = new InputHandler();
    this.movementSystem = new MovementSystem(this.input, this.entityManager);
    this.enemySystem = new EnemySystem(this.entityManager);
    this.combatSystem = new CombatSystem(this.entityManager);

    this.tileManager = new TileManager(); // Handles all tilemaps
    this.tileRenderer = null;             // Draws tilemaps
    this.tileset = null;                  // Handles tileset slicing
    
    this.renderer = null;
    this.isLoaded = false;
  }

  async load() {
    // Load tileset image
    const tilesetImg = await AssetLoader.loadImage("dungeon", "/assets/tilesets/level-tileset.png");
    this.tileset = new Tileset(tilesetImg, 32, 32, 0);
    console.log("Tileset image loaded:", tilesetImg.width, tilesetImg.height);

    // Load Tilemap from Tiled JSON using helper
    const testMap = await loadTilemapFromJSON("/assets/maps/level-map.json", 32, 32);


  
    // Add map to manager and set up renderer
    this.tileManager.addMap("ground", testMap);
    this.tileRenderer = new TileRenderer(testMap, this.tileset);


    const playerImg = await AssetLoader.loadImage("player", "/assets/player.png");
    const enemyImg = await AssetLoader.loadImage("enemy", "/assets/enemy.png");
    
    const standardWidth = 32;
    const standardHeight = 32;

    const player = this.entityManager.getPlayer();
    player.width = standardWidth;
    player.height = standardHeight;
    player.sprite = {
      image: playerImg,
      frameWidth: playerImg.width,
      frameHeight: playerImg.height,
    };

    for (const enemy of this.entityManager.enemies) {
      enemy.width = standardWidth;
      enemy.height = standardHeight;
      enemy.sprite = {
        image: enemyImg,
        frameWidth: enemyImg.width,
        frameHeight: enemyImg.height,
      };
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

  }

  getContext() {
    const canvas = document.getElementById("gameCanvas");

    // TODO: move to config?

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

    this.movementSystem.update();
    this.enemySystem.updateAllEnemies(deltaTime);

    // basic collision handling
    // resolvePlayerEnemyCollisions(
    //   this.entityManager.getPlayer(),
    //   this.entityManager.enemies,
    //   (player, enemy, index) => {
    //     console.log(`💥 Player collided with enemy ${index}`);
    //     player.health -= 10;
    //     this.combatSystem.attackEnemy(index);
    //     console.log(`Player health: ${player.health}`);
    //   }
    // );
  
  }

  render(ctx) {
    if (!this.isLoaded) return;

    // Debug background
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
    const player = this.entityManager.getPlayer();
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
