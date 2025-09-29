import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class PadSize extends SxClass {
  static override token = "size"
  static override parentToken = "pad"
  token = "size"

  private _width: number
  private _height: number

  constructor(width: number, height: number) {
    super()
    this._width = width
    this._height = height
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadSize {
    const width = toNumberValue(primitiveSexprs[0])
    const height = toNumberValue(primitiveSexprs[1])
    if (width === undefined || height === undefined) {
      throw new Error("size requires width and height numeric values")
    }
    return new PadSize(width, height)
  }

  get width(): number {
    return this._width
  }

  set width(value: number) {
    this._width = value
  }

  get height(): number {
    return this._height
  }

  set height(value: number) {
    this._height = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(size ${this._width} ${this._height})`
  }
}
SxClass.register(PadSize)
