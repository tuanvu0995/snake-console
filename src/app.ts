import "./setup";

import { GameObject } from "./gameobject";
import { MenuScreen } from "./scenes/menu_screen";
import { Screen } from "./screen";
import { emitter } from "./setup";
import { GameScreen } from "./scenes/game_screen";

const FRAME_RATE = 30;
const screen = new Screen();

function main() {
  let currentScene: GameObject = new MenuScreen(screen);
  currentScene.ready();

  emitter.on("changeScene", (scene: string) => {
    switch (scene) {
      case "menu":
        currentScene = new MenuScreen(screen);
        break;
      case "game":
        currentScene = new GameScreen();
        break;
    }
    currentScene.ready();
  });

  function loop() {
    currentScene.update();
    screen.clear();
    currentScene.draw();
    setTimeout(loop, 1000 / FRAME_RATE);
  }
  loop();
}

main();
