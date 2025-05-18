// src/console/commands/coreCommands.js
export default function registerCoreCommands(register, aliasMap, print) {
    register("clear", () => {
      const outputEl = document.getElementById("jconsole-output");
      if (outputEl) outputEl.innerHTML = "";
    });
    
    register("clearhistory", () => {
    localStorage.removeItem("jconsole-command-history");
    if (window.__jconsole_history__) {
      window.__jconsole_history__.length = 0; // Clear in-memory array
      window.__jconsole_history_index__ = 0;  // Reset history index if tracked
    }
    print("🗑️ Command history cleared.");
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
  