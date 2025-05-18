// src/console/commands/coreCommands.js
export default function registerCoreCommands(register, aliasMap, print) {
    register("clear", () => {
      const outputEl = document.getElementById("jconsole-output");
      if (outputEl) outputEl.innerHTML = "";
    });
  
    register("alias", (args) => {
      const name = args[0];
      const definition = args.slice(1).join(" ");
  
      if (!name || !definition) {
        print("Usage: alias <name> <full command>");
        return;
      }
  
      aliasMap[name] = definition;
      print(`Alias set: ${name} → ${definition}`);
    });
  }
  