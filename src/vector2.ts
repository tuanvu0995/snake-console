export class Vector2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  move(x: number, y: number) {
    this.x += x
    this.y += y
  }

  collides(other: Vector2) {
    return this.x === other.x && this.y === other.y
  }

  forward(direction: Vector2) {
    return new Vector2(this.x + direction.x, this.y + direction.y)
  }

  sub(other: Vector2) {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  distance(other: Vector2) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  leftOf(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  rightOf(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  toString() {
    return `(${this.x}, ${this.y})`
  }

  static UP = new Vector2(0, -1)
  static DOWN = new Vector2(0, 1)
  static LEFT = new Vector2(-1, 0)
  static RIGHT = new Vector2(1, 0)
}

export { Vector2 as default }
