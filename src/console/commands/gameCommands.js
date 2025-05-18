// src/console/commands/gameCommands.js
export default function registerGameCommands(register, print, entityManager) {
    register("spawn", ([x, y]) => {
      if (!x || !y) return print("Usage: spawn <x> <y>");
      entityManager.spawnEnemy(parseInt(x), parseInt(y));
      print(`Spawned enemy at (${x}, ${y})`);
    });
  
    // ... other commands stay the same

  register("move", (args) => {
    const target = args[0];
    if (target === "player") {
      const dx = parseInt(args[1], 10);
      const dy = parseInt(args[2], 10);
      if (isNaN(dx) || isNaN(dy)) return print("Usage: move player <dx> <dy>");
      entityManager.movePlayer(dx, dy);
      print(`Moved player by (${dx}, ${dy})`);
    } else if (target === "enemy") {
      const index = parseInt(args[1], 10);
      const dx = parseInt(args[2], 10);
      const dy = parseInt(args[3], 10);
      if (isNaN(index) || isNaN(dx) || isNaN(dy)) return print("Usage: move enemy <index> <dx> <dy>");
      entityManager.moveEnemy(index, dx, dy);
      print(`Moved enemy ${index} by (${dx}, ${dy})`);
    } else {
      print("Usage: move player <dx> <dy> OR move enemy <index> <dx> <dy>");
    }
  });

  register("attack", ([index]) => {
    const result = entityManager.attackEnemy(parseInt(index));
    print(`Enemy ${index}: ${result}`);
  });

  register("status", () => {
    const player = entityManager.getPlayer();
    const score = entityManager.getScore();
    print(`Health: ${player.health} | Score: ${score}`);
    print(`Inventory: ${player.inventory.join(", ") || "Empty"}`);
  });
}
