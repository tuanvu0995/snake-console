import Vector2 from "../vector2"
import { Screen } from "../screen"
import { Snake } from "./snake"
import { World } from "./world"
import { GameUI } from "./game_ui"
import { Food } from "./food"
import { GameObject } from "../types"
import { GameLevel, GameOptions } from "../types"

export class GameScreen extends GameObject {
  public size: Vector2 = new Vector2(21, 21)

  public maxScore = 0

  public snake = new Snake(this, this.screen)
  public food = new Food(this, this.screen, this.snake)

  public scenes = [
    new World(this, this.screen),
    this.snake,
    this.food,
    new GameUI(this, this.screen),
  ]

  public level: GameLevel = "super"
  public score = 0
  public time = 0
  public isStarted = false
  public isWin = false
  public isGameOver = false

  constructor(
    private screen: Screen,
    options?: GameOptions
  ) {
    super()
    if (options?.level) {
      this.level = options.level
    }
    if (options?.size) {
      this.size = options.size
    }
  }

  get height() {
    return Math.min(this.screen.rows, this.size.y + 2)
  }

  get width() {
    return Math.min(this.screen.cols, this.size.x + 2)
  }

  public ready() {
    this.maxScore = this.size.x * this.size.y
    this.scenes.forEach((scene) => scene.ready())
    this.start()
  }

  public update() {
    if (!this.isStarted) return
    this.scenes.forEach((scene) => scene.update())
  }

  public draw() {
    this.scenes.forEach((scene) => scene.draw())
  }

  public destroy() {
    this.scenes.forEach((scene) => scene.destroy && scene.destroy())
  }

  private startTimer() {
    if (!this.isStarted) return
    this.time++
    setTimeout(this.startTimer.bind(this), 1000)
  }

  get moveSpeed() {
    switch (this.level) {
      case "normal":
        return 8
      case "hard":
        return 5
      case "super":
        return 2
      case "ghost":
        return 1
      case "easy":
      default:
        return 12
    }
  }

  public increaseScore() {
    this.score++
  }

  public start() {
    this.isStarted = true
    this.startTimer()
  }

  public gameOver() {
    this.isStarted = false
    this.isGameOver = true
  }

  public win() {
    this.isStarted = false
    this.isWin = true
  }
}
