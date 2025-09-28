import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { indentLines } from "../utils/indentLines"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { TextEffects } from "./TextEffects"
import { SymbolPropertyId as PropertyId } from "./Symbol"
import { toNumberValue } from "../utils/toNumberValue"

export class SheetSize extends SxClass {
  static override token = "size"
  static override parentToken = "sheet"
  token = "size"

  width: number
  height: number

  constructor(width: number, height: number) {
    super()
    this.width = width
    this.height = height
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetSize {
    const width = toNumberValue(primitiveSexprs[0])
    const height = toNumberValue(primitiveSexprs[1])
    if (width === undefined || height === undefined) {
      throw new Error("sheet size requires numeric width and height")
    }
    return new SheetSize(width, height)
  }

  toObject(): { width: number; height: number } {
    return { width: this.width, height: this.height }
  }

  override getString(): string {
    return `(size ${this.width} ${this.height})`
  }
}
SxClass.register(SheetSize)
