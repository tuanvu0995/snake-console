import { GameScreen } from "./game_screen"
import { Screen } from "../screen"
import Vector2 from "../vector2"
import { Snake } from "./snake"
import chalk from "chalk"
import { PathNode } from "../types"

export class SnakeOpponent extends Snake {
  public body: Vector2[] = []
  public direction: Vector2 = Vector2.LEFT

  public color = chalk.bgMagenta.black

  constructor(
    protected game: GameScreen,
    protected screen: Screen,
    protected startPostion: Vector2
  ) {
    super(game, screen)
  }

  public ready(): void {
    // init from start position and direction
    this.body = [
      new Vector2(this.startPostion.x, this.startPostion.y),
      this.startPostion.add(this.direction),
      this.startPostion.add(this.direction).add(this.direction),
    ]
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
    const distance = this.head.distance(food);
    if (distance < 1) return;
  
    const path = this.findPathToFood(food);
    if (path.length < 2) return;
  
    const next = path[1]; // Phần tử thứ hai là bước tiếp theo
  
    const direction = next.sub(this.head);
    this.direction = direction;
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

        if (this.collidesWith(nextPos) || visited.has(nextPosStr)) {
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
}
