import chalk from "chalk"
import { GameObject } from "../gameobject"
import { Screen } from "../screen"
import { emitter } from "../setup"
import { KEY_MAP, LEVELS, SCREEN_SIZE } from "../constants"
import Vector2 from "../vector2"

export class LevelScreen extends GameObject {
  private width = SCREEN_SIZE.width
  private height = SCREEN_SIZE.height

  private levels = [...LEVELS, "Back"]

  private selected = 1

  protected config = {
    level: "normal",
    size: new Vector2(21, 21),
  }

  constructor(
    private screen: Screen,
    params?: any
  ) {
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
        this.selected = Math.min(this.levels.length - 1, this.selected + 1)
        break
      case KEY_MAP.ENTER:
        this.handleEnter()
        break
    }
  }

  private handleEnter(): void {
    if (this.levels[this.selected] === "Back") {
      emitter.emit("changeScene", "menu")
      return
    }

    emitter.emit("changeOptions", {
      level: this.levels[this.selected],
    })

    emitter.emit("changeScene", "custom")
  }

  public update(): void {}
  public draw(): void {
    const rows = []
    for (let i = 0; i < this.height; i++) {
      rows.push(chalk.bgWhiteBright(" ").repeat(this.width))
    }
    this.screen.draw(rows.join("\n"))

    this.screen.cursorTo(2, 1).draw(chalk.bgWhiteBright.black("Select Level"))

    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i]
      const color =
        i === this.selected ? chalk.bgBlueBright.black : chalk.bgWhiteBright
      this.screen
        .cursorTo(2, 3 + i)
        .draw(color(level) + color(" ").repeat(this.width / 2))
    }
  }
}
