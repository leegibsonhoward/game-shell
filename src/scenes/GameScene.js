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
import Tilemap from "../core/tiles/Tilemap.js";
import TileRenderer from "../core/tiles/TileRenderer.js";
import TileManager from "../core/tiles/TileManager.js";

export default class GameScene {
  constructor() {
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
    const tilesetImg = await AssetLoader.loadImage("dungeon", "/assets/tilesets/test-tileset.png");
    this.tileset = new Tileset(tilesetImg, 32, 32);
    console.log("Tileset image loaded:", tilesetImg.width, tilesetImg.height);

    // Create a test tilemap (12x8) - blue computer
    const testMap = new Tilemap([
      [16, 17, 18, 19, 20, 21, 22, 23],
      [48, 49, 50, 51, 52, 53, 54, 55],
      [16, 17, 18, 19, 20, 21, 22, 23],
      [16, 17, 18, 19, 20, 21, 22, 23],
      [48, 49, 50, 51, 52, 53, 54, 55],
      [80, 81, 82, 83, 84, 85, 86, 87],
      [112, 113, 114, 115, 116, 117, 118, 119],
      [144, 145, 146, 147, 148, 149, 150, 151],
      [176, 177, 178, 179, 180, 181, 182, 183],
      [208, 209, 210, 211, 212, 213, 214, 215],
      [240, 241, 242, 243, 244, 245, 246, 247],
      [272, 273, 274, 275, 276, 277, 278, 279],  
    ], 32, 32);

  
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
  }

  getContext() {
    const canvas = document.getElementById("gameCanvas");

    // Define logical resolution
    const width = 640;
    const height = 480;
    const scale = 1;

    // Set canvas resolution
    canvas.width = width;
    canvas.height = height;

    // Set displayed (CSS) size
    canvas.style.width = `${width * scale}px`;
    canvas.style.height = `${height * scale}px`;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    //console.log("Canvas initialized:", canvas.width, canvas.height);
    return ctx;
  }

  update(deltaTime) {
    if (!this.isLoaded) return;

    this.movementSystem.update();
    this.enemySystem.updateAllEnemies(deltaTime);

    // basic collision handling
    resolvePlayerEnemyCollisions(
      this.entityManager.getPlayer(),
      this.entityManager.enemies,
      (player, enemy, index) => {
        console.log(`💥 Player collided with enemy ${index}`);
        player.health -= 10;
        this.combatSystem.attackEnemy(index);
        console.log(`Player health: ${player.health}`);
      }
    );
  
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
 // ✅ Draw game entities
   this.renderer.render();

    // ✅ Draw HUD
    const player = this.entityManager.getPlayer();
    ctx.fillStyle = "#00FF00";
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#000";
    ctx.fillRect(5, 5, 180, 45);
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 5, 180, 45);
    ctx.fillStyle = "#00FF00";
    ctx.fillText(`❤ HEALTH: ${player.health}`, 10, 20);
    ctx.fillText(`📍 X:${Math.floor(player.x)} Y:${Math.floor(player.y)}`, 10, 40);

}

  unload() {
    AssetLoader.clear();
    this.tileManager.clear();
  }
}
