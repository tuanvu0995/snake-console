export class Screen {
  get rows() {
    return process.stdout.rows;
  }

  get cols() {
    return process.stdout.columns;
  }

  clear() {
    process.stdout.write("\x1Bc");
    return this;
  }

  draw(text: string) {
    process.stdout.write(text);
    return this;
  }

  cursorTo(x: number, y: number) {
    process.stdout.cursorTo(x, y);
    return this;
  }
}
