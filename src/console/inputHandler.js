// src/console/inputHandler.js
export default function handleConsoleInput(inputEl, outputEl, handleCommand, print) {
    let commandHistory = JSON.parse(localStorage.getItem("jconsole-command-history") || "[]");
    let historyIndex = commandHistory.length;
  
    inputEl.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const input = inputEl.value.trim();
        if (input) {
          print("> " + input);
          commandHistory.push(input);
          historyIndex = commandHistory.length;
          localStorage.setItem("jconsole-command-history", JSON.stringify(commandHistory));
          await handleCommand(input);
          inputEl.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const currentInput = inputEl.value.trim();
        const words = currentInput.split(" ");
        const base = words[0];
        const matches = Object.keys(handleCommand.commands).filter((cmd) => cmd.startsWith(base));
        if (matches.length === 1) {
          inputEl.value = matches[0] + " ";
        } else if (matches.length > 1) {
          print("Suggestions: " + matches.join(", "));
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          inputEl.value = commandHistory[historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          inputEl.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          inputEl.value = "";
        }
      }
    });
  }
  