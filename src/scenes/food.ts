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
    let pos: Vector2
    do {
      pos = new Vector2(
        Math.max(Math.floor(Math.random() * this.game.width - 1), 1),
        Math.max(Math.floor(Math.random() * this.game.height - 1), 1)
      )
    } while (this.snake.body.some((b) => b.collides(pos)))

    this.position = pos
  }
}
