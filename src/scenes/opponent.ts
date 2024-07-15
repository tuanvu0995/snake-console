import { GameScreen } from "./game_screen"
import { Screen } from "../screen"
import Vector2 from "../vector2"
import { Snake } from "./snake"
import chalk from "chalk"
import { PathNode, SnakeStartPos } from "../types"

export class SnakeOpponent extends Snake {
  public color = chalk.bgMagenta.black

  constructor(
    protected game: GameScreen,
    protected screen: Screen,
    protected pos: SnakeStartPos
  ) {
    super(game, screen)
  }

  public ready(): void {
    this.snakes = this.game.snakes.filter((s) => s.id !== this.id)
    // init from start position and direction
    switch (this.pos) {
      case "topright":
        this.body = [
          new Vector2(this.game.width - 2, 1),
          new Vector2(this.game.width - 2, 2),
          new Vector2(this.game.width - 2, 3),
        ]
        this.direction = Vector2.DOWN
        break
      case "bottomright":
        this.body = [
          new Vector2(this.game.width - 2, this.game.height - 2),
          new Vector2(this.game.width - 3, this.game.height - 2),
          new Vector2(this.game.width - 4, this.game.height - 2),
        ]
        this.direction = Vector2.LEFT
        break
      case "bottomleft":
      default:
        this.body = [
          new Vector2(1, this.game.height - 2),
          new Vector2(1, this.game.height - 3),
          new Vector2(1, this.game.height - 4),
        ]
        this.direction = Vector2.UP
    }
  }

  protected dead() {
    this.isDead = true
  }

  protected move() {
    this.moveToFood(this.game.food.position)
    const newHead = new Vector2(this.head.x, this.head.y)
    newHead.move(this.direction.x, this.direction.y)
    this.body.push(newHead)
    this.body.shift()
  }

  public moveToFood(food: Vector2) {
    const distance = this.head.distance(food)

    const target: Vector2 = food
    if (distance < 1) return

    const path = this.findPathToFood(target)
    if (path.length < 2) return

    const next = path[1] // Phần tử thứ hai là bước tiếp theo

    const direction = next.sub(this.head)
    this.direction = direction
  }

  private findPathToFood(food: Vector2): Vector2[] {
    const path: Vector2[] = []
    const visited: Set<string> = new Set()
    const queue: PathNode[] = []

    queue.push({
      pos: this.head,
      parent: null,
    })

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current) break

      const currentPosStr = current.pos.toString() // Assuming Vector2 has a toString method for unique string representation
      if (visited.has(currentPosStr)) continue

      visited.add(currentPosStr)

      if (current.pos.collides(food)) {
        let c: PathNode | null = current
        while (c) {
          path.unshift(c.pos) // Add to path in reverse order
          c = c.parent!
        }
        break
      }

      const directions = [Vector2.UP, Vector2.DOWN, Vector2.LEFT, Vector2.RIGHT]
      for (const dir of directions) {
        const nextPos = current.pos.forward(dir)
        const nextPosStr = nextPos.toString()

        if (
          nextPos.x < 1 ||
          nextPos.x >= this.game.width - 1 ||
          nextPos.y < 1 ||
          nextPos.y >= this.game.height - 1 ||
          this.collidesWith(nextPos) ||
          this.body.some((segment) => segment.collides(nextPos)) || // Check collision with this snake's body
          this.snakes.some((snake) =>
            snake.body.some((segment) => segment.collides(nextPos))
          ) || // Check collision with other snakes' bodies
          visited.has(nextPosStr)
        ) {
          continue
        }

        queue.push({
          pos: nextPos,
          parent: current,
        })
      }
    }

    return path
  }

  protected isCollideWithFood(): boolean {
    return this.head.collides(this.game.food.position)
  }

  protected isCollideWithWall(): boolean {
    return (
      this.head.x === 0 ||
      this.head.x === this.game.width - 1 ||
      this.head.y === 0 ||
      this.head.y === this.game.height - 1
    )
  }
}
