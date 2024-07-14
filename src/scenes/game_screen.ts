import Vector2 from "../vector2"
import { Screen } from "../screen"
import { Snake } from "./snake"
import { World } from "./world"
import { GameUI } from "./game_ui"
import { Food } from "./food"
import { GameObject } from "../gameobject"

type GameLevel = "easy" | "medium" | "hard" | "super" | "ghost"

type GameOptions = {
  size?: Vector2
  level?: GameLevel
}

export class GameScreen extends GameObject {
  private screen = new Screen()
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

  constructor(options?: GameOptions) {
    super()
    if (options?.level) {
      this.level = options.level
    }
    if (options?.size) {
      this.size = options.size
    }
  }

  get height() {
    return Math.min(this.screen.rows, this.size.y)
  }

  get width() {
    return Math.min(this.screen.cols, this.size.x)
  }

  public ready() {
    this.maxScore = this.size.x * this.size.y
    this.scenes.forEach((scene) => scene.ready())
    this.start()
  }

  public update() {
    if (!this.isStarted) return
    this.scenes.forEach((scene) => scene.update())
    this.screen.clear()
    this.scenes.forEach((scene) => scene.draw())
  }

  public draw() {
    this.scenes.forEach((scene) => scene.draw())
  }

  public destroy() {
    this.scenes.forEach((scene) => scene.destroy && scene.destroy())
  }

  private countTime() {
    if (!this.isStarted) return
    this.time++
    setTimeout(this.countTime.bind(this), 1000)
  }

  get moveSpeed() {
    switch (this.level) {
      case "medium":
        return 15
      case "hard":
        return 5
      case "super":
        return 2
      case "ghost":
        return 1
      case "easy":
      default:
        return 30
    }
  }

  public increaseScore() {
    this.score++
  }

  public start() {
    this.isStarted = true
    this.countTime()
  }

  public gameOver() {
    this.isStarted = false
    this.isGameOver = true
  }

  public win() {
    this.isStarted = false
    this.isWin = true
  }

  public restart() {
    this.isGameOver = false
    this.isStarted = false
    this.isWin = false
    this.score = 0
    this.time = 0
    this.scenes.forEach((obj) => obj.ready())

    this.start()
  }
}
