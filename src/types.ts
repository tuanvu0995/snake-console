import type Vector2 from "./vector2"

export type GameLevel = "easy" | "normal" | "hard" | "super" | "ghost"

export type GameOptions = {
    size: Vector2
    level: GameLevel
}
  

export abstract class GameObject {
    public abstract ready(): void;
    public abstract draw(): void;
    public abstract update(): void;
    public abstract destroy(): void;
  }
  