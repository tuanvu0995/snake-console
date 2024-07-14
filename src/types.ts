import type Vector2 from "./vector2"

export type GameLevel = "easy" | "normal" | "hard" | "super" | "ghost"

export type GameOptions = {
    size: Vector2
    level: GameLevel
}
  