import type Vector2 from "./vector2"

export type GameLevel = "easy" | "normal" | "hard" | "super" | "ghost"

export type GameOptions = {
  size: Vector2
  level: GameLevel
}

/*
| This is an abstract class that all game objects should extend from.
| It provides a basic structure for all game objects.
*/
export abstract class GameObject {
  /**
   * This method is called when the game object the scene is attached to is ready.
   */
  public abstract ready(): void
  /**
   * This method is called every frame to update any logic in the game object.
   */
  public abstract update(deltaTime?: number): void
  /**
   * This method is called every frame to draw the game object.
   */
  public abstract draw(deltaTime?: number): void
  /**
   * This method is called when the game object is destroyed.
   */
  public abstract destroy(): void
}
