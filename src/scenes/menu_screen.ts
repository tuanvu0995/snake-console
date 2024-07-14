import chalk from "chalk";
import { GameObject } from "../gameobject";
import { Screen } from "../screen";
import { emitter } from "../setup";
import { KEY_MAP } from "../constants";

export class MenuScreen extends GameObject {
  private width = 30;
  private height = 8;

  private options = ["Play", "Quit"];
  private selected = 0;

  constructor(private screen: Screen) {
    super();
  }

  public ready(): void {
    emitter.on("keypress", (key: string) => {
      switch (key) {
        case KEY_MAP.UP:
          this.selected = Math.max(0, this.selected - 1);
          break;
        case KEY_MAP.DOWN:
          this.selected = Math.min(this.options.length - 1, this.selected + 1);
          break;
        case KEY_MAP.ENTER:
          if (this.selected === 0) {
            emitter.emit("changeScene", "game");
          } else {
            process.exit(0);
          }
          break;
      }
    });
  }
  public update(): void {}
  public draw(): void {
    this.drawMainMenu();
  }

  public drawMainMenu() {
    const rows = [];
    for (let i = 0; i < this.height; i++) {
      rows.push(chalk.bgWhiteBright(" ").repeat(this.width));
    }
    this.screen.draw(rows.join("\n"));

    this.screen.cursorTo(2, 1).draw(chalk.bgWhiteBright.black("Console Snake"));

    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];
      const color =
        i === this.selected ? chalk.bgBlueBright.black : chalk.bgWhiteBright;
      this.screen
        .cursorTo(2, 3 + i)
        .draw(color(option) + color(" ").repeat(this.width / 2));
    }
  }
}
