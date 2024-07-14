import chalk from "chalk"
import { GameObject } from "../gameobject"
import { Screen } from "../screen"
import { GameScreen } from "./game_screen"
import { emitter } from "../setup"
import { KEY_MAP } from "../constants"

export class GameUI extends GameObject {
  private options = ["Play again", "Main menu"]
  private selected = 0

  constructor(
    private game: GameScreen,
    private screen: Screen
  ) {
    super()
  }

  public ready(): void {
    emitter.on("keypress", this.handleKeyPress.bind(this))
  }

  private handleKeyPress(key: string): void {
    switch (key) {
      case KEY_MAP.UP:
        this.selected = Math.max(0, this.selected - 1)
        break
      case KEY_MAP.DOWN:
        this.selected = Math.min(this.options.length - 1, this.selected + 1)
        break
      case KEY_MAP.ENTER:
        if (this.selected === 0) {
          this.game.restart()
          this.selected = 0
        } else {
          emitter.emit("changeScene", {
            scene: "menu",
          })
        }
        break
    }
  }

  public update(): void {}

  public destroy(): void {
    emitter.removeListener("keypress", this.handleKeyPress)
  }

  public draw(): void {
    if (this.game.isGameOver) {
      return this.drawGameOver()
    }

    if (this.game.isWin) {
      return this.drawWin()
    }

    this.drawLevel()
    this.drawScore()
    this.drawTime()
  }

  private drawWin(): void {
    // clear background
    for (let y = 0; y < this.game.height; y++) {
      this.screen
        .cursorTo(0, y)
        .draw(chalk.bgWhiteBright(" ").repeat(this.game.width * 2))
    }

    // draw in the center
    this.screen.cursorTo(3, 4).draw(chalk.green("You win!"))

    // // render options
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i]
      const color =
        i === this.selected ? chalk.bgBlueBright.black : chalk.bgWhiteBright
      this.screen.cursorTo(3, 6 + i).draw(color(option) + color(" ").repeat(5))
    }
  }

  public drawGameOver(): void {
    // clear background
    for (let y = 0; y < this.game.height; y++) {
      this.screen
        .cursorTo(0, y)
        .draw(chalk.bgWhiteBright(" ").repeat(this.game.width * 2))
    }

    // draw in the center
    this.screen.cursorTo(3, 4).draw(chalk.red("Game Over"))

    // // render options
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i]
      const color =
        i === this.selected ? chalk.bgBlueBright.black : chalk.bgWhiteBright
      this.screen.cursorTo(3, 6 + i).draw(color(option) + color(" ").repeat(5))
    }
  }

  private drawScore() {
    // draw in the center
    // format 0 to 000
    this.screen
      .cursorTo(14, this.game.height)
      .draw(
        chalk.yellow(`Score: ${this.game.score.toString().padStart(4, "0")}`)
      )
  }

  drawLevel() {
    // draw in the left corner
    this.screen
      .cursorTo(0, this.game.height)
      .draw(chalk.yellow(`Level: ${this.game.level}`))
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
    )
  }
}
