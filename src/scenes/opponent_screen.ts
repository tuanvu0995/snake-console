import chalk from "chalk"
import { GameObject } from "../types"
import { Screen } from "../screen"
import { emitter } from "../setup"
import { KEY_MAP, SCREEN_SIZE } from "../constants"

export class OpponentScreen extends GameObject {
  private width = SCREEN_SIZE.width
  private height = SCREEN_SIZE.height

  private options = [0, 1, 2, 3, "Back"]
  private selected = 0

  constructor(private screen: Screen) {
    super()
  }

  public ready(): void {
    emitter.on("keypress", this.handleKeyPress)
  }

  public destroy(): void {
    emitter.removeListener("keypress", this.handleKeyPress)
  }

  private handleKeyPress = (key: string) => {
    switch (key) {
      case KEY_MAP.UP:
        this.selected = Math.max(0, this.selected - 1)
        break
      case KEY_MAP.DOWN:
        this.selected = Math.min(this.options.length - 1, this.selected + 1)
        break
      case KEY_MAP.ENTER:
        this.handleEnter()
        break
    }
  }

  private handleEnter(): void {
    if (this.options[this.selected] === "Custom") {
      emitter.emit("changeScene", "menu")
      return
    }

    emitter.emit("changeOptions", {
      opponentCount: this.options[this.selected],
    })

    emitter.emit("changeScene", "game")
  }

  public update(): void {}
  public draw(): void {
    const rows = []
    for (let i = 0; i < this.height; i++) {
      rows.push(chalk.bgWhiteBright(" ").repeat(this.width))
    }
    this.screen.draw(rows.join("\n"))

    this.screen
      .cursorTo(2, 1)
      .draw(chalk.bgWhiteBright.black("Select Opponents"))

    for (let i = 0; i < this.options.length; i++) {
      const level = this.options[i]
      const color =
        i === this.selected ? chalk.bgBlueBright.black : chalk.bgWhiteBright
      this.screen
        .cursorTo(2, 3 + i)
        .draw(
          color(level === 0 ? "None" : level) +
            color(" ").repeat(this.width / 2)
        )
    }
  }
}
