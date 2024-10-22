import Vector2 from "../vector2"
import { Screen } from "../screen"
import { Snake } from "./snake"
import { World } from "./world"
import { GameUI } from "./game_ui"
import { Food } from "./food"
import { GameObject, SnakeStartPos } from "../types"
import { GameLevel, GameOptions } from "../types"
import { SnakeOpponent } from "./opponent"

export class GameScreen extends GameObject {
  public size: Vector2 = new Vector2(21, 21)
  public opponentCount = 0

  public maxScore = 0

  public snakes: Snake[] = [new Snake(this, this.screen)]
  public food: Food = new Food(this, this.screen)

  public scenes = [
    new World(this, this.screen),
    ...this.snakes,
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
    if (options?.opponentCount) {
      this.opponentCount = options.opponentCount
    }

    this.createOpponents()
  }

  get height() {
    return Math.min(this.screen.rows, this.size.y + 2)
  }

  get width() {
    return Math.min(this.screen.cols, this.size.x + 2)
  }

  private createOpponents() {
    if (!this.opponentCount) return
    for (let i = 1; i <= this.opponentCount; i++) {
      let startPos: SnakeStartPos
      let dir: Vector2
      switch (i) {
        case 1:
          startPos = "topright"
          break
        case 2:
          startPos = "bottomright"
          break
        case 3:
        default:
          startPos = "bottomleft"
      }
      const snake = new SnakeOpponent(this, this.screen, startPos)
      this.snakes.push(snake)
      this.scenes.push(snake)
    }
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
