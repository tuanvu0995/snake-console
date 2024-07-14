import chalk from "chalk";
import { GameObject } from "../gameobject";
import { GameManager } from "./game_screen";
import { Screen } from "../screen";

export class World extends GameObject {
  constructor(private game: GameManager, private screen: Screen) {
    super();
  }

  public ready(): void {}
  public update(): void {}
  public draw(): void {
    if (this.game.isGameOver) {
      return this.drawGameOver();
    }

    if (this.game.isPaused) {
      return this.drawPause();
    }

    if (this.game.isWin) {
      return this.drawWin();
    }

    this.drawMap();
  }

  private drawMap() {
    const blocks: string[] = [];
    const wall = chalk.bgBlue(" ");
    for (let y = 0; y < this.game.height; y++) {
      let row = "";
      for (let x = 0; x < this.game.width; x++) {
        if (
          x === 0 ||
          x === this.game.width - 1 ||
          y === 0 ||
          y === this.game.height - 1
        ) {
          row += wall + chalk.bgBlue(" ");
        } else {
          row += chalk.bgWhite(" ") + chalk.bgWhite(" ");
        }
      }
      blocks.push(row);
    }
    this.screen.draw(blocks.join("\n"));
  }

  public drawGameOver() {
    this.screen.cursorTo(0, 0);
    this.screen.draw(chalk.bgRed("Game Over!"));
  }

  public drawPause() {}

  public drawStart() {
    this.screen.cursorTo(0, 0);
    this.screen.draw(chalk.bgGreen("Press any key to start!"));
  }

  public drawWin() {
    this.screen.cursorTo(0, 0);
    this.screen.draw(chalk.bgGreen("You win!"));
  }
}
