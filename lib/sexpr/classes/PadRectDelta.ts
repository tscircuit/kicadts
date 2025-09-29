import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class PadRectDelta extends SxClass {
  static override token = "rect_delta"
  static override parentToken = "pad"
  override token = "rect_delta"

  private _x: number
  private _y: number

  constructor(x = 0, y = 0) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadRectDelta {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error("pad rect_delta expects two numeric arguments")
    }

    return new PadRectDelta(x, y)
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(rect_delta ${this._x} ${this._y})`
  }
}
SxClass.register(PadRectDelta)
