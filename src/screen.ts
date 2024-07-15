export class Screen {
  private buffer: string = ""

  get rows() {
    return process.stdout.rows
  }

  get cols() {
    return process.stdout.columns
  }

  clear() {
    this.buffer += "\x1Bc"
    return this
  }

  draw(text: string) {
    this.buffer += text
    return this
  }

  cursorTo(x: number, y: number) {
    this.buffer += `\x1B[${y + 1};${x + 1}H`
    return this
  }

  flush() {
    process.stdout.write(this.buffer)
    this.buffer = "" // Reset buffer after flushing
    return this
  }
}
