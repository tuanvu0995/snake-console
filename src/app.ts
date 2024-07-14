import { emitter } from "./setup";
import { GameObject } from "./gameobject";
import { MenuScreen } from "./scenes/menu_screen";
import { Screen } from "./screen";
import { GameScreen } from "./scenes/game_screen";

const FRAME_RATE = 30;
const screen = new Screen();

function main() {
  let currentScene: GameObject = new MenuScreen(screen);
  currentScene.ready();

  emitter.on("changeScene", (params: { scene: string; options?: any }) => {
    currentScene.destroy();

    switch (params.scene) {
      case "menu":
        currentScene = new MenuScreen(screen);
        break;
      case "game":
        currentScene = new GameScreen(params.options);
        break;
    }
    currentScene.ready();
  });

  emitter.on("quit", () => {
    screen.clear();
    console.log("Goodbye!");
    process.exit();
  });

  function loop() {
    currentScene.update();
    screen.clear();
    currentScene.draw();
    setTimeout(loop, 1000 / FRAME_RATE);
  }
  loop();

  process.on("exit", () => {
    screen.clear();
    process.stdin.setRawMode(false);
  });
}

main();
