export class Screen {
  private output = process.stdout;

  get rows() {
    return process.stdout.rows;
  }

  get cols() {
    return process.stdout.columns;
  }

  clear() {
    this.output.write("\x1Bc");
    return this;
  }

  draw(text: string) {
    this.output.write(text);
    return this;
  }

  cursorTo(x: number, y: number) {
    this.output.cursorTo(x, y);
    return this;
  }
}
