import { SxClass } from "../base-classes/SxClass"

export class At extends SxClass {
  static override token = "at"
  token = "at"

  constructor(
    args: [x: number, y: number, angle?: number],
    opts: { isTextSymbol?: boolean } = {},
  ) {
    super()
    this.x = args[0]
    this.y = args[1]
    this.angle = args[2]
    if (this.angle && opts.isTextSymbol) {
      this.angle *= 10
    }
  }

  x: number
  y: number
  angle?: number

  override getString(): string {
    const parts: Array<string | number> = [this.x, this.y]
    if (this.angle !== undefined) {
      parts.push(this.angle)
    }
    return `(at ${parts.join(" ")})`
  }
}
SxClass.register(At)
