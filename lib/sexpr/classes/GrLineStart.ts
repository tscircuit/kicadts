import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class GrLineStart extends SxClass {
  static override token = "start"
  static override parentToken = "gr_line"
  override token = "start"

  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrLineStart {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error("gr_line start expects two numeric arguments")
    }

    return new GrLineStart(x, y)
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

  toObject(): { x: number; y: number } {
    return { x: this._x, y: this._y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(start ${this._x} ${this._y})`
  }
}
SxClass.register(GrLineStart)
