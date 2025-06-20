// src/console/InputHandler.js
export default function handleConsoleInput(inputEl, outputEl, handleCommand, print) {
    let commandHistory = JSON.parse(localStorage.getItem("jconsole-command-history") || "[]");
    let historyIndex = commandHistory.length;

    // Make accessible globally for clearhistory command
    window.__jconsole_history__ = commandHistory;
    window.__jconsole_history_index__ = historyIndex;

    inputEl.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const input = inputEl.value.trim();
        if (input) {
          print("> " + input);
          commandHistory.push(input);
          historyIndex = commandHistory.length;
          window.__jconsole_history_index__ = historyIndex; // sync global index
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
            if (window.__jconsole_history_index__ > 0) {
                window.__jconsole_history_index__--;
                inputEl.value = window.__jconsole_history__[window.__jconsole_history_index__] || "";
      }
      } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (window.__jconsole_history_index__ < window.__jconsole_history__.length - 1) {
                window.__jconsole_history_index__++;
                inputEl.value = window.__jconsole_history__[window.__jconsole_history_index__];
      } else {
            window.__jconsole_history_index__ = window.__jconsole_history__.length;
            inputEl.value = "";
        }
      }
    });
  }
  