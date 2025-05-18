// src/console/jconsole.js
import createConsoleUI from "./ui.js";
import handleConsoleInput from "./inputHandler.js";
import setupCommandRegistry from "./commandRegistry.js";
import SceneManager from "../core/SceneManager.js";

// Get the current scene’s entity manager
const entityManager = SceneManager.getScene()?.entityManager;

const { inputEl, outputEl, toggle, print } = createConsoleUI();

const commandHandler = setupCommandRegistry(print, entityManager);
console.log("Available commands:", Object.keys(commandHandler.commands));

handleConsoleInput(inputEl, outputEl, commandHandler, print);

// Toggle on Ctrl + `
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "`") {
    toggle();
    e.preventDefault();
  }
});

export default {
  print,
  toggle,
};
