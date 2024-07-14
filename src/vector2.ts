export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  collides(other: Vector2) {
    return this.x === other.x && this.y === other.y;
  }

  forward(direction: Vector2) {
    return new Vector2(this.x + direction.x, this.y + direction.y);
  }

  static UP = new Vector2(0, -1);
  static DOWN = new Vector2(0, 1);
  static LEFT = new Vector2(-1, 0);
  static RIGHT = new Vector2(1, 0);
}

export { Vector2 as default };
