import Vector2 from "../vector2";
import { Screen } from "../screen";
import { Snake } from "./snake";
import { World } from "./world";
import { GameUI } from "./game_ui";
import { Food } from "./food";
import { GameObject } from "../gameobject";

type GameLevel = "easy" | "medium" | "hard" | "super" | "ghost";

type GameOptions = {
  size?: Vector2;
  level?: GameLevel;
};

export class GameScreen extends GameObject {
  private screen = new Screen();
  public size: Vector2 = new Vector2(21, 21);

  public snake = new Snake(this, this.screen);
  public food = new Food(this, this.screen, this.snake);

  public scenes = [
    new World(this, this.screen),
    new GameUI(this, this.screen),
    this.snake,
    this.food,
  ];

  public level: GameLevel = "super";
  public score = 0;
  public time = 0;
  public isStarted = false;
  public isPaused = false;
  public isWin = false;
  public isGameOver = false;

  constructor(options?: GameOptions) {
    super();
    if (options?.level) {
      this.level = options.level;
    }
    if (options?.size) {
      this.size = options.size;
    }
  }

  public ready() {
    this.scenes.forEach((scene) => scene.ready());
    this.start();
  }

  public update() {
    if (!this.isPaused && this.isStarted && !this.isGameOver) {
      this.scenes.forEach((scene) => scene.update());
      this.screen.clear();
      this.scenes.forEach((scene) => scene.draw());
    }
  }

  public draw() {
    this.scenes.forEach((scene) => scene.draw());
  }

  get height() {
    return Math.min(this.screen.rows, this.size.y);
  }

  get width() {
    return Math.min(this.screen.cols, this.size.x);
  }

  private countTime() {
    this.time++;
    setTimeout(this.countTime.bind(this), 1000);
  }

  get moveSpeed() {
    switch (this.level) {
      case "medium":
        return 15;
      case "hard":
        return 5;
      case "super":
        return 2;
      case "ghost":
        return 1;
      case "easy":
      default:
        return 30;
    }
  }

  public increaseScore() {
    this.score++;
  }

  public start() {
    this.isStarted = true;
    this.countTime();
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }

  public gameOver() {
    this.isGameOver = true;
  }

  public restart() {
    this.isGameOver = false;
    this.score = 0;
    this.time = 0;
    this.scenes.forEach((obj) => obj.ready());
  }
}
