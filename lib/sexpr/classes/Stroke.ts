import { SxClass } from "../base-classes/SxClass"
import { Width } from "./Width"
import { StrokeType, type StrokeTypeString } from "./StrokeType"
import { Color, type RGBAColor } from "./Color"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export type StrokeProperty = Width | StrokeType | Color

export class Stroke extends SxClass {
  static override token = "stroke"
  token = "stroke"

  _sxWidth?: Width
  _sxType?: StrokeType
  _sxColor?: Color

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Stroke {
    const stroke = new Stroke()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )
    stroke._sxWidth = propertyMap.width as Width
    stroke._sxType = propertyMap.type as StrokeType
    stroke._sxColor = propertyMap.color as Color

    return stroke
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  get type(): StrokeTypeString | undefined {
    return this._sxType?.type
  }

  get color(): RGBAColor | undefined {
    return this._sxColor?.color
  }

  set width(width: number) {
    this._sxWidth = new Width(width)
  }

  set type(type: StrokeTypeString) {
    this._sxType = new StrokeType(type)
  }

  set color(color: RGBAColor) {
    // TODO accept color as string
    this._sxColor = new Color([color.r, color.g, color.b, color.a])
  }
}
SxClass.register(Stroke)
