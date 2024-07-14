export abstract class GameObject {
  public abstract ready(): void;
  public abstract draw(): void;
  public abstract update(): void;
  public abstract destroy(): void;
}
