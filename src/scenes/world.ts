import chalk from "chalk"
import { GameObject } from "../gameobject"
import { GameScreen } from "./game_screen"
import { Screen } from "../screen"

export class World implements GameObject {
  constructor(
    private game: GameScreen,
    private screen: Screen
  ) {
  }

  public ready(): void {}
  public update(): void {}
  public draw(): void {
    this.drawMap()
  }

  private drawMap() {
    const blocks: string[] = []
    const wall = chalk.bgBlue(" ")
    for (let y = 0; y < this.game.height; y++) {
      let row = ""
      for (let x = 0; x < this.game.width; x++) {
        if (
          x === 0 ||
          x === this.game.width - 1 ||
          y === 0 ||
          y === this.game.height - 1
        ) {
          row += wall + chalk.bgBlue(" ")
        } else {
          row += chalk.bgWhite(" ") + chalk.bgWhite(" ")
        }
      }
      blocks.push(row)
    }
    this.screen.draw(blocks.join("\n"))
  }

  public destroy(): void {}
}
