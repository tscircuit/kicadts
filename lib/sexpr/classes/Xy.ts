import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class Xy extends SxClass {
  static override token = "xy"
  token = "xy"

  x: number
  y: number

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Xy {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX) ?? 0
    const y = toNumberValue(rawY) ?? 0
    return new Xy(x, y)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(xy ${this.x} ${this.y})`
  }
}
SxClass.register(Xy)
