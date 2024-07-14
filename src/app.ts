import { emitter } from "./setup";
import { MainScreen } from "./scenes/main_screen";
import { Screen } from "./screen";
import { GameScreen } from "./scenes/game_screen";
import { GameOptions, GameObject } from "./types";
import { CustomScreen } from "./scenes/custom_screen";
import { LevelScreen } from "./scenes/level_screen";
import Vector2 from "./vector2";

const FRAME_RATE = 24;
const screen = new Screen();


function main() {
  let currentScene: GameObject = new MainScreen(screen);
  currentScene.ready();

  const gameOptions: GameOptions = {
    level: "normal",
    size: new Vector2(21, 21),
  };

  emitter.on('changeOptions', (options: GameOptions) => {
    if (options.level) {
      gameOptions.level = options.level;
    }
    if (options.size) {
      gameOptions.size = options.size;
    }
  });

  emitter.on("changeScene", (scene: string) => {
    currentScene.destroy();

    switch (scene) {
      case "menu":
        currentScene = new MainScreen(screen);
        break;
      case "level":
        currentScene = new LevelScreen(screen);
        break;
      case "custom":
        currentScene = new CustomScreen(screen);
        break;
      case "game":
        currentScene = new GameScreen(screen, gameOptions);
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
    try {
      currentScene.update();
      screen.clear();
      currentScene.draw();
      } catch (error) {
      console.error(error);
      process.exit(1);
    }
    setTimeout(loop, 1000 / FRAME_RATE);
  }
  loop();

  process.on("exit", () => {
    // screen.clear();
    process.stdin.setRawMode(false);
  });
}

main();
