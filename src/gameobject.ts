export abstract class GameObject {
  public type: "ui" | "object" = "object";
  public abstract ready(): void;
  public abstract draw(): void;
  public abstract update(): void;
}
