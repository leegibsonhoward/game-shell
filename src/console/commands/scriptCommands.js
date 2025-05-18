// src/console/commands/scriptCommands.js
export default function registerScriptCommands(register, print, handleCommand) {
    register("run", async ([filename]) => {
      if (!filename) return print("Usage: run <filename>");
  
      try {
        const response = await fetch(`/src/scripts/${filename}`);
        if (!response.ok) {
          throw new Error(`File not found: ${filename}`);
        }
  
        const text = await response.text();
        if (text.startsWith("<!DOCTYPE html")) {
          throw new Error(`Invalid file (HTML fallback): ${filename}`);
        }
  
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  
        if (typeof handleCommand !== "function") {
          print("Error: internal command handler is not a function.");
          return;
        }
  
        for (const line of lines) {
          print(`> ${line}`);
          await handleCommand(line);
          await new Promise((res) => setTimeout(res, 100));
        }
      } catch (e) {
        print(e.message);
      }
    });
  
    register("record", ([action, filename]) => {
      if (action === "start") {
        if (typeof handleCommand.enableRecording !== "function") {
          print("Error: recording is not supported.");
          return;
        }
        handleCommand.enableRecording(filename);
        print(`🔴 Recording started: ${filename || "macro.txt"}`);
      } else if (action === "stop") {
        const session = handleCommand.disableRecording?.();
        if (!session?.commands?.length) {
          print("⚠️ No commands were recorded.");
          return;
        }
  
        const blob = new Blob([session.commands.join("\n")], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = session.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        print(`🟢 Recording saved to ${session.filename}`);
      } else {
        print("Usage: record start <filename> | record stop");
      }
    });
  
    register("savehistory", ([filename]) => {
      filename = filename || "history.txt";
      const rawHistory = localStorage.getItem("jconsole-command-history") || "[]";
      const history = JSON.parse(rawHistory);
      const excluded = ["savehistory", "record", "run"];
      const filtered = history.filter(cmd => !excluded.includes(cmd.split(" ")[0]));
  
      if (!filtered.length) {
        print("⚠️ No command history to save (after excluding 'savehistory').");
        return;
      }
  
      const blob = new Blob([filtered.join("\n")], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      print(`💾 History saved to ${filename}`);
    });
  }
  