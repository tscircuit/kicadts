import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { indentLines } from "../utils/indentLines"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { TextEffects } from "./TextEffects"
import { SymbolPropertyId as PropertyId } from "./Symbol"
import type { Color } from "./Color"

export class SheetFill extends SxClass {
  static override token = "fill"
  static override parentToken = "sheet"
  token = "fill"

  private _sxColor?: Color

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetFill {
    const fill = new SheetFill()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    fill._sxColor = propertyMap.color as Color | undefined

    return fill
  }

  get color(): Color | undefined {
    return this._sxColor
  }

  set color(value: Color | undefined) {
    this._sxColor = value
  }

  override getChildren(): SxClass[] {
    return this._sxColor ? [this._sxColor] : []
  }
}
SxClass.register(SheetFill)
