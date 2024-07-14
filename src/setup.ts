import readLine from "readline";
import { EventEmitter } from "node:events";

// Enable keypress events
readLine.emitKeypressEvents(process.stdin);

process.stdin.setRawMode(true);
process.stdin.setEncoding("utf8");

const emitter = new EventEmitter();

process.stdin.on("keypress", (_, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  } else {
    emitter.emit("keypress", key.name);
  }
});

export { emitter };
