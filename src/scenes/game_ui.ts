import chalk from "chalk";
import { GameObject } from "../gameobject";
import { Screen } from "../screen";
import { GameScreen } from "./game_screen";

export class GameUI extends GameObject {
  constructor(private game: GameScreen, private screen: Screen) {
    super();
  }

  public ready(): void {}

  public update(): void {}

  public draw(): void {
    this.drawLevel();
    this.drawScore();
    this.drawTime();
  }

  public drawGameOver(): void {
    // draw in the center
    this.screen
      .cursorTo(
        this.game.width - 5,
        this.game.height - 1
      )
      .draw(chalk.red("Game Over"));
  }

  private drawScore() {
    // draw in the center
    // format 0 to 000
    this.screen
      .cursorTo(14, this.game.height)
      .draw(
        chalk.yellow(`Score: ${this.game.score.toString().padStart(4, "0")}`)
      );
  }

  drawLevel() {
    // draw in the left corner
    this.screen
      .cursorTo(0, this.game.height)
      .draw(chalk.yellow(`Level: ${this.game.level}`));
  }

  drawTime() {
    // draw in the right corner
    // format 0 to 00:00
    this.screen.cursorTo(this.game.width * 2 - 11, this.game.height).draw(
      chalk.yellow(
        `Time: ${Math.floor(this.game.time / 60)
          .toString()
          .padStart(2, "0")}:${(this.game.time % 60)
          .toString()
          .padStart(2, "0")}\n`
      )
    );
  }
}
