import { SxClass } from "../base-classes/SxClass"
import { Width } from "./Width"
import { StrokeType, type StrokeTypeString } from "./StrokeType"
import { Color, type RGBAColor } from "./Color"

export type StrokeProperty = Width | StrokeType | Color

export class Stroke extends SxClass {
  static override token = "stroke"
  token = "stroke"

  override _propertyMap: {
    width?: Width
    type?: StrokeType
    color?: Color
  } = {}

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

  constructor(args: Array<StrokeProperty>, opts?: {}) {
    super()
    this._propertyMap = args.reduce(
      (acc, p) => {
        acc[p.token] = p
        return acc
      },
      {} as Record<string, StrokeProperty>,
    )
  }
}
SxClass.register(Stroke)
