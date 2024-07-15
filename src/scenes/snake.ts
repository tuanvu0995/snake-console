import chalk from "chalk"
import { GameScreen } from "./game_screen"
import { GameObject } from "../types"
import { Screen } from "../screen"
import { emitter } from "../setup"
import Vector2 from "../vector2"
import { KEY_MAP } from "../constants"
import { randomInt } from "crypto"

export class Snake extends GameObject {
  public id: string = randomInt(1000).toString() + Date.now()
  public body: Vector2[] = []
  public direction: Vector2 = Vector2.RIGHT

  public color = chalk.bgBlack.white

  protected isDead = false

  protected frameCount = 0

  constructor(
    protected game: GameScreen,
    protected screen: Screen
  ) {
    super()
  }

  public ready(): void {
    this.body = [new Vector2(1, 1), new Vector2(2, 1), new Vector2(3, 1)]
    emitter.on("keypress", this.handleKeyPress)
  }

  public destroy(): void {
    emitter.removeListener("keypress", this.handleKeyPress)
  }

  private handleKeyPress = (key: string) => {
    if (!this.game.isStarted) return

    switch (key) {
      case KEY_MAP.UP:
        this.changeDirection(Vector2.UP)
        break
      case KEY_MAP.DOWN:
        this.changeDirection(Vector2.DOWN)
        break
      case KEY_MAP.LEFT:
        this.changeDirection(Vector2.LEFT)
        break
      case KEY_MAP.RIGHT:
        this.changeDirection(Vector2.RIGHT)
        break
    }
  }

  public update(): void {
    if (this.isDead) return

    if (this.game.score >= this.game.maxScore) {
      this.game.isWin = true
      this.game.isStarted = false
      return
    }

    this.frameCount++
    if (this.frameCount < this.game.moveSpeed) return

    if (this.isCollideWithOthers() || this.isCollideWithWall()) {
      this.dead()
      return
    }

    if (this.isCollideWithFood()) {
      this.eatIt()
    }

    this.move()
    this.frameCount = 0
  }

  protected move() {
    const newHead = new Vector2(this.head.x, this.head.y)
    newHead.move(this.direction.x, this.direction.y)
    this.body.push(newHead)
    this.body.shift()
  }

  protected dead() {
    this.isDead = true
    this.game.gameOver()
  }

  public collidesWith(pos: Vector2) {
    return this.body.some((b) => b.collides(pos))
  }

  public changeDirection(direction: Vector2) {
    // the snake can't move back
    if (
      this.direction.x === -1 * direction.x &&
      this.direction.y === -1 * direction.y
    ) {
      return
    }

    this.direction = direction
  }

  public draw() {
    if (this.isDead || !this.game.isStarted) return

    for (let i = 0; i < this.body.length; i++) {
      const pos = this.body[i]
      this.screen
        .cursorTo(pos.x * 2, pos.y)
        .draw(this.color("  "))
        .cursorTo(this.game.width, this.game.height)
    }
  }

  protected eatIt() {
    this.grow()
    this.game.food.spawn()
  }

  protected grow() {
    this.game.increaseScore()
    const newHead = new Vector2(this.head.x, this.head.y)
    this.body.push(newHead)
  }

  protected isCollideWithFood(): boolean {
    return this.head.collides(this.game.food.position)
  }

  protected isCollideWithOthers(forward?: Vector2): boolean {
    const _forward = forward ? forward : this.head.forward(this.direction)
    const snakes = this.game.snakes.filter((s) => s.id !== this.id && !s.isDead)
    return snakes.some((snake) => snake.collidesWith(_forward))
  }

  protected isCollideWithWall(forward?: Vector2): boolean {
    const _forward = forward ? forward : this.head.forward(this.direction)
    return (
      _forward.x === 0 ||
      _forward.x === this.game.width - 1 ||
      _forward.y === 0 ||
      _forward.y === this.game.height - 1
    )
  }

  get head() {
    return this.body[this.body.length - 1]
  }
}
