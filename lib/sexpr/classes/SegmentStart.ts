import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class SegmentStart extends SxClass {
  static override token = "start"
  static override parentToken = "segment"
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
  ): SegmentStart {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)
    if (x === undefined || y === undefined) {
      throw new Error("start expects two numeric arguments")
    }
    return new SegmentStart(x, y)
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
SxClass.register(SegmentStart)
