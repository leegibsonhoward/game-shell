// src/console/ui.js
export default function createConsoleUI() {
    const consoleEl = document.createElement("div");
    consoleEl.className = "jconsole-overlay";
    consoleEl.innerHTML = `
      <div class="jconsole-output" id="jconsole-output" tabindex="0"></div>
      <input type="text" class="jconsole-input" id="jconsole-input" placeholder="Type a command..." />
    `;
    document.body.appendChild(consoleEl);
  
    const inputEl = document.getElementById("jconsole-input");
    const outputEl = document.getElementById("jconsole-output");
  
    if (outputEl && inputEl) {
      outputEl.addEventListener("click", () => inputEl.focus());
    }
  
    function toggle() {
      consoleEl.classList.toggle("visible");
      if (consoleEl.classList.contains("visible")) {
        inputEl.focus();
        outputEl.scrollTop = outputEl.scrollHeight;
      }
    }
  
    function print(text) {
      const line = document.createElement("div");
      outputEl.appendChild(line);
      let i = 0;
  
      function typeChar() {
        if (i < text.length) {
          line.textContent += text.charAt(i);
          i++;
          setTimeout(typeChar, 8);
        } else {
          outputEl.scrollTop = outputEl.scrollHeight;
        }
      }
  
      typeChar();
    }
  
    return {
      inputEl,
      outputEl,
      toggle,
      print,
    };
  }
  