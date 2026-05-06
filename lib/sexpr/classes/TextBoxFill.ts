import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Color } from "./Color"

export class TextBoxFill extends SxClass {
  static override token = "fill"
  static override parentToken = "text_box"
  override token = "fill"

  private _sxType?: SxClass
  private _sxColor?: Color

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextBoxFill {
    const fill = new TextBoxFill()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      "fill",
    )
    fill._sxType = propertyMap.type
    fill._sxColor = propertyMap.color as Color | undefined
    return fill
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxType) children.push(this._sxType)
    if (this._sxColor) children.push(this._sxColor)
    return children
  }
}
SxClass.register(TextBoxFill)
