import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export type AtInput =
  | At
  | [x: number, y: number, angle?: number]
  | { x: number; y: number; angle?: number }

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

  static from(input: AtInput, opts: { isTextSymbol?: boolean } = {}): At {
    if (input instanceof At) {
      return input
    }
    if (Array.isArray(input)) {
      return new At(input, opts)
    }
    return new At([input.x, input.y, input.angle], opts)
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): At {
    const [x, y, angle] = primitiveSexprs
    return new At([x as number, y as number, angle as number])
  }

  override getString(): string {
    const parts: Array<string | number> = [this.x, this.y]
    if (this.angle !== undefined) {
      parts.push(this.angle)
    }
    return `(at ${parts.join(" ")})`
  }
}
SxClass.register(At)
