import chalk from "chalk"
import { GameObject } from "../gameobject"
import { Screen } from "../screen"
import { emitter } from "../setup"
import { KEY_MAP, LEVELS, MAP_SIZE } from "../constants"
import Vector2 from "../vector2"

export class MenuScreen extends GameObject {
  private width = 30
  private height = 12

  private current: "main" | "level" | "custom" = "main"

  private menus = ["Play", "Level", "Custom", "Quit"]
  private levels = LEVELS

  private selected = 0

  private size = "21x21"
  private sizeError = ""

  protected config = {
    level: "normal",
    size: new Vector2(21, 21),
  }

  constructor(private screen: Screen) {
    super()
  }

  public ready(): void {
    emitter.on("keypress", this.handleKeyPress.bind(this))
  }

  private handleKeyPress(key: string): void {
    if (this.current === "custom") {
      return this.handleCustomSize(key)
    }

    switch (key) {
      case KEY_MAP.UP:
        this.selected = Math.max(0, this.selected - 1)
        break
      case KEY_MAP.DOWN:
        const length =
          this.current === "level" ? this.levels.length : this.menus.length
        this.selected = Math.min(length - 1, this.selected + 1)
        break
      case KEY_MAP.ENTER:
        if (this.current === "level") {
          return this.handleSelectLevel(key)
        }
        this.handleMenuSelect(this.menus[this.selected])
        break
    }
  }

  private handleMenuSelect(key: string): void {
    switch (this.menus[this.selected]) {
      case "Play":
        emitter.emit("changeScene", {
          scene: "game",
          options: this.config,
        })
        break
      case "Level":
        this.selected = this.levels.indexOf(this.config.level)
        this.current = "level"
        break
      case "Custom":
        this.current = "custom"
        break
      case "Quit":
        emitter.emit("quit")
        break
    }
  }

  private handleCustomSize(key: string): void {
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

      this.config.size = new Vector2(width, height)
      this.current = "main"
      this.selected = 3
    }

    // acept only number and x
    if (!/^\d|x$/.test(key)) return

    if (this.size.length == 5) {
      this.size = key
    } else {
      this.size = this.size + key
    }
  }

  private handleSelectLevel(key: string): void {
    const level = this.levels[this.selected]
    this.config.level = level
    this.current = "main"
    this.selected = 1
  }

  public update(): void {}
  public draw(): void {
    switch (this.current) {
      case "level":
        this.drawLevelMenu()
        break
      case "custom":
        this.drawCustomMenu()
        break
      case "main":
      default:
        this.drawMainMenu()
    }
  }
  public destroy(): void {
    emitter.removeListener("keypress", this.handleKeyPress.bind(this))
  }

  private drawMainMenu() {
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
      .draw(chalk.bgWhiteBright.black("Use w,s,a,d to move,"))
    this.screen
      .cursorTo(1, this.height - 2)
      .draw(chalk.bgWhiteBright.black("Enter to select"))
  }

  private drawLevelMenu() {
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

  private drawCustomMenu() {
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
