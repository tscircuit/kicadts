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
    console.log(propertyMap)
    stroke._sxWidth = propertyMap.width as Width
    stroke._sxType = propertyMap.type as StrokeType
    stroke._sxColor = propertyMap.color as Color

    return stroke
  }

  get width(): number {
    return this._propertyMap.width!.width
  }

  get type(): StrokeTypeString {
    return this._propertyMap.type!.type
  }

  get color(): RGBAColor {
    return this._propertyMap.color!.color
  }

  set width(width: number) {
    this._propertyMap.width = new Width([width])
  }

  set type(type: StrokeTypeString) {
    this._propertyMap.type = new StrokeType([type])
  }

  set color(color: RGBAColor) {
    // TODO accept color as string
    this._propertyMap.color = new Color([color.r, color.g, color.b, color.a])
  }

  override getChildren() {
    return [this._sxWidth, this._sxType, this._sxColor].filter(
      Boolean,
    ) as SxClass[]
  }
}
SxClass.register(Stroke)
