import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class PadDrillOffset extends SxClass {
  static override token = "offset"
  static override parentToken = "drill"
  token = "offset"

  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadDrillOffset {
    const x = toNumberValue(primitiveSexprs[0])
    const y = toNumberValue(primitiveSexprs[1])
    if (x === undefined || y === undefined) {
      throw new Error("drill offset requires x and y numeric values")
    }
    return new PadDrillOffset(x, y)
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
    return `(offset ${this._x} ${this._y})`
  }
}
SxClass.register(PadDrillOffset)
