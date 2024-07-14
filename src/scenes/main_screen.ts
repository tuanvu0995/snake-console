import chalk from "chalk"
import { GameObject } from "../types"
import { Screen } from "../screen"
import { emitter } from "../setup"
import { KEY_MAP, SCREEN_SIZE } from "../constants"
import Vector2 from "../vector2"

export class MainScreen extends GameObject {
  private width = SCREEN_SIZE.width
  private height = SCREEN_SIZE.height

  private menus = ["Play", "Quit"]
  private selected = 0

  protected config = {
    level: "normal",
    size: new Vector2(21, 21),
  }

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
        this.selected = Math.min(this.menus.length - 1, this.selected + 1)
        break
      case KEY_MAP.ENTER:
        this.handleSelect()
        break
    }
  }

  private handleSelect(): void {
    switch (this.menus[this.selected]) {
      case "Play":
        emitter.emit("changeScene", "level")
        break
      case "Quit":
        emitter.emit("quit")
        break
    }
  }

  public update(): void {}
  public draw(): void {
    const rows = []
    for (let i = 0; i < this.height; i++) {
      rows.push(chalk.bgWhiteBright(" ").repeat(this.width))
    }
    this.screen.draw(rows.join("\n"))

    this.screen.cursorTo(2, 1).draw(chalk.bgWhiteBright.black("Console Snake"))

    for (let i = 0; i < this.menus.length; i++) {
      const option = this.menus[i]
      const color =
        i === this.selected ? chalk.bgBlueBright.black : chalk.bgWhiteBright
      this.screen
        .cursorTo(2, 3 + i)
        .draw(color(option) + color(" ").repeat(this.width / 2))
    }

    this.screen
      .cursorTo(1, this.height - 3)
      .draw(chalk.bgWhiteBright.black("Use arrow keys to move,"))
    this.screen
      .cursorTo(1, this.height - 2)
      .draw(chalk.bgWhiteBright.black("Enter to select"))
  }
}
