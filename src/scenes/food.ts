import chalk from "chalk"
import { GameScreen } from "./game_screen"
import { GameObject } from "../types"
import { Screen } from "../screen"
import Vector2 from "../vector2"
import { Snake } from "./snake"

export class Food extends GameObject {
  public position: Vector2 = new Vector2(0, 0)

  constructor(
    private game: GameScreen,
    private screen: Screen,
    private snake: Snake
  ) {
    super()
  }

  public ready(): void {
    this.spawn()
  }

  public update(): void {}

  public draw(): void {
    this.screen
      .cursorTo(this.position.x * 2, this.position.y)
      .draw(chalk.bgGreen("\u25CF\u25CF"))
      .cursorTo(this.game.width + 1, this.game.height + 1)
  }

  public destroy(): void {}

  public spawn() {
    // spawn food in random position and make sure it's not on the snake
    const emptyPositions = this.getEmtpyPositions()
    const randomIndex = Math.floor(Math.random() * emptyPositions.length)
    this.position = emptyPositions[randomIndex]
  }

  private getEmtpyPositions(): Vector2[] {
    const positions: Vector2[] = []
    for (let x = 1; x < this.game.width - 1; x++) {
      for (let y = 1; y < this.game.height - 1; y++) {
        const vec = new Vector2(x, y)
        if (!this.snake.body.some((b) => b.collides(vec))) {
          positions.push(vec)
        }
      }
    }
    return positions
  }
}
