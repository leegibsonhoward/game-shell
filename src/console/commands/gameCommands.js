// src/console/commands/gameCommands.js

// const scene = window.currentScene;
// in each register function prevents window.currentScene
// from becoming outdated with future dynamic scene switching
export default function registerGameCommands(register, print) {
    register("spawn", ([x, y]) => {
      if (!x || !y) return print("Usage: spawn <x> <y>");
      
      const scene = window.currentScene;
      if (!scene?.entityManager) return print("No active scene or entity manager");

      scene.entityManager.spawnEnemy(parseInt(x), parseInt(y));
      print(`Spawned enemy at (${x}, ${y})`);
    });
    
    // ... other commands stay the same

  register("move", (args) => {
    const scene = window.currentScene;
    if(!scene?.enemySystem || !scene?.entityManager) return print("Scene or system not available");

    const target = args[0];
    if (target === "player") {
      const dx = parseInt(args[1], 10);
      const dy = parseInt(args[2], 10);
      
      if (isNaN(dx) || isNaN(dy)) return print("Usage: move player <dx> <dy>");
      
      //const player = scene.entityManager.getPlayer();
      //player.x += dx;
      //player.y += dy;
      scene.movementSystem.manualMovePlayer(dx, dy);
      
      print(`Moved player by (${dx}, ${dy})`);
    
    } else if (target === "enemy") {
      const index = parseInt(args[1], 10);
      const dx = parseInt(args[2], 10);
      const dy = parseInt(args[3], 10);
    
      if (isNaN(index) || isNaN(dx) || isNaN(dy)) return print("Usage: move enemy <index> <dx> <dy>");
      
      scene.enemySystem.moveEnemy(index, dx, dy);
    
      print(`Moved enemy ${index} by (${dx}, ${dy})`);
    
    } else {
      print("Usage: move player <dx> <dy> OR move enemy <index> <dx> <dy>");
    }
  });

  register("attack", ([index]) => {
    const scene = window.currentScene;
    if (!scene?.combatSystem) return print("No combat system available.");

    const result = scene.combatSystem.attackEnemy(parseInt(index));
    print(`Enemy ${index}: ${result}`);
  });

  register("status", () => {
const scene = window.currentScene;
    if (!scene?.entityManager) return print("No entity manager.");

    const player = scene.entityManager.getPlayer();
    const score = scene.entityManager.getScore();
    print(`Health: ${player.health} | Score: ${score}`);
    print(`Inventory: ${player.inventory.join(", ") || "Empty"}`);
  });
}
