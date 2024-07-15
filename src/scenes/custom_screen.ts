import chalk from "chalk"
import { GameObject } from "../types"
import { Screen } from "../screen"
import { emitter } from "../setup"
import { KEY_MAP, MAP_SIZE, SCREEN_SIZE } from "../constants"
import Vector2 from "../vector2"

export class CustomScreen implements GameObject {
  private width = SCREEN_SIZE.width
  private height = SCREEN_SIZE.height

  private size = "21x21"
  private sizeError = ""

  constructor(private screen: Screen) {}

  public ready(): void {
    emitter.on("keypress", this.handleKeyPress)
  }

  public destroy(): void {
    emitter.removeListener("keypress", this.handleKeyPress)
  }

  private handleKeyPress = (key: string) => {
    this.sizeError = ""

    // if delete key, remove last char
    if (key === KEY_MAP.BACKSPACE) {
      this.size = this.size.slice(0, -1)
      return
    }

    if (key === KEY_MAP.ENTER) {
      // validate size
      const [width, height] = this.size.split("x").map((n) => parseInt(n))
      if (isNaN(width) || isNaN(height)) {
        this.sizeError = "Invalid size"
        return
      }

      if (
        width < MAP_SIZE.min ||
        height < MAP_SIZE.min ||
        width > MAP_SIZE.max ||
        height > MAP_SIZE.max
      ) {
        this.sizeError = "Size out of range"
        return
      }

      const newSize = new Vector2(width, height)

      emitter.emit("changeOptions", {
        size: newSize,
      })

      emitter.emit("changeScene", "opponent")
    }

    // acept only number and x
    if (!/^\d|x$/.test(key)) return

    if (this.size.length == 5) {
      this.size = key
    } else {
      this.size = this.size + key
    }
  }

  public update(): void {}
  public draw(): void {
    const rows = []
    for (let i = 0; i < this.height; i++) {
      rows.push(chalk.bgWhiteBright(" ").repeat(this.width))
    }
    this.screen.draw(rows.join("\n"))

    this.screen.cursorTo(2, 1).draw(chalk.bgWhiteBright.black("Custom Size"))
    this.screen
      .cursorTo(2, 2)
      .draw(
        chalk.bgWhiteBright.black(
          `Min: ${MAP_SIZE.min}/${MAP_SIZE.min}, Max: ${MAP_SIZE.max}/${MAP_SIZE.max}`
        )
      )

    this.screen.cursorTo(2, 4).draw(this.size)
    if (this.sizeError) {
      this.screen.cursorTo(2, 5).draw(chalk.bgRed.black(this.sizeError))
    }
    this.screen
      .cursorTo(2, 10)
      .draw(chalk.bgWhiteBright.black("Press Enter to confirm"))
  }
}
