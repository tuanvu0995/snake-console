import chalk from "chalk";
import { GameManager } from "./game_screen";
import { GameObject } from "../gameobject";
import { Screen } from "../screen";
import { emitter } from "../setup";
import Vector2 from "../vector2";

export class Snake extends GameObject {
  public body: Vector2[] = [];
  public direction: Vector2 = Vector2.RIGHT;

  private frameCount = 0;

  constructor(private game: GameManager, private screen: Screen) {
    super();
  }

  ready(): void {
    this.body = [new Vector2(1, 1), new Vector2(2, 1), new Vector2(3, 1)];

    emitter.on("keypress", (key: string) => {
      switch (key) {
        case "w":
          this.changeDirection(Vector2.UP);
          break;
        case "s":
          this.changeDirection(Vector2.DOWN);
          break;
        case "a":
          this.changeDirection(Vector2.LEFT);
          break;
        case "d":
          this.changeDirection(Vector2.RIGHT);
          break;
      }
    });
  }

  public update(): void {
    if (!this.game.isStarted || this.game.isPaused || this.game.isGameOver)
      return;

    this.frameCount++;
    if (this.frameCount < this.game.moveSpeed) return;

    if (this.isCollideWithSelf() || this.isCollideWithWall()) {
      this.game.gameOver();
      return;
    }

    if (this.isCollideWithFood()) {
      this.eatIt();
    }

    this.move();
    this.frameCount = 0;
  }

  private move() {
    const newHead = new Vector2(this.head.x, this.head.y);
    newHead.move(this.direction.x, this.direction.y);
    this.body.push(newHead);
    this.body.shift();
  }

  private changeDirection(direction: Vector2) {
    // the snake can't move back
    if (
      this.direction.x === -1 * direction.x &&
      this.direction.y === -1 * direction.y
    ) {
      return;
    }

    this.direction = direction;
  }

  public draw() {
    for (let i = 0; i < this.body.length; i++) {
      const pos = this.body[i];
      let point = chalk.black("  ");

      this.screen.cursorTo(pos.x * 2, pos.y).draw(point);
      this.screen.cursorTo(this.game.width, this.game.height);
    }
  }

  private eatIt() {
    this.grow();
    this.game.food.spawn();
  }

  private grow() {
    this.game.increaseScore();
    const newHead = new Vector2(this.head.x, this.head.y);
    this.body.push(newHead);
  }

  private isCollideWithFood() {
    const forward = this.head.forward(this.direction);
    return forward.collides(this.game.food.position);
  }

  private isCollideWithSelf() {
    const forward = this.head.forward(this.direction);
    for (let i = this.body.length - 2; i >= 0; i--) {
      if (forward.collides(this.body[i])) {
        return true;
      }
    }
    return false;
  }

  private isCollideWithWall() {
    const forward = this.head.forward(this.direction);
    return (
      forward.x === 0 ||
      forward.x === this.game.width - 1 ||
      forward.y === 0 ||
      forward.y === this.game.height - 1
    );
  }

  get head() {
    return this.body[this.body.length - 1];
  }
}
