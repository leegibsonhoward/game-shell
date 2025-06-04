// src/console/commandRegistry.js
import registerCoreCommands from "./commands/coreCommands.js";
import registerGameCommands from "./commands/gameCommands.js";
import registerScriptCommands from "./commands/scriptCommands.js";

export default function setupCommandRegistry(print, entityManager, enemySystem) {
  const commands = {};
  const aliasMap = {};

  let recording = false;
  let recordedCommands = [];
  let recordingFilename = "";

  function registerCommand(name, handler) {
    commands[name] = handler;
  }

  async function handleCommand(rawInput) {
    const [cmdRaw, ...args] = rawInput.split(" ");
    const cmd = aliasMap[cmdRaw] ? aliasMap[cmdRaw].split(" ")[0] : cmdRaw;
    const fullArgs = aliasMap[cmdRaw] ? [...aliasMap[cmdRaw].split(" ").slice(1), ...args] : args;
    const command = commands[cmd];

    const baseCmd = cmdRaw.toLowerCase();
    const resolvedCmd = cmd.toLowerCase();

    if (
      recording &&
      !["record", "run", "savehistory"].includes(baseCmd) &&
      !["record", "run", "savehistory"].includes(resolvedCmd)
    ) {
      recordedCommands.push(rawInput);
    }

    if (command) {
      try {
        await command(fullArgs);
      } catch (err) {
        print("Error: " + err.message);
      }
    } else {
      print(`Unknown command: ${cmdRaw}`);
    }
  }

  function enableRecording(filename) {
    recordingFilename = filename || "macro.txt";
    recordedCommands = [];
    recording = true;
  }

  function disableRecording() {
    recording = false;
    return { filename: recordingFilename, commands: recordedCommands };
  }

  handleCommand.commands = commands;
  handleCommand.aliasMap = aliasMap;
  handleCommand.enableRecording = enableRecording;
  handleCommand.disableRecording = disableRecording;

  console.log("Registered handleCommand object:", handleCommand);
  console.log("EntityManager available:", entityManager);

  registerCoreCommands(registerCommand, aliasMap, print);
  registerGameCommands(registerCommand, print, enemySystem);
  registerScriptCommands(registerCommand, print, handleCommand);

  return handleCommand;
}
