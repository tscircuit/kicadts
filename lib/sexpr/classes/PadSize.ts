import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export type PadSizeInput =
  | PadSize
  | [width: number, height: number]
  | { width: number; height: number }

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

  static from(input: PadSizeInput): PadSize {
    if (input instanceof PadSize) {
      return input
    }
    if (Array.isArray(input)) {
      return new PadSize(input[0], input[1])
    }
    return new PadSize(input.width, input.height)
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
