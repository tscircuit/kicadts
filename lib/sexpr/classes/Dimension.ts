import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import "./DimensionFormat"
import "./DimensionHeight"
import "./DimensionLeaderLength"
import "./DimensionLocked"
import "./DimensionOrientation"
import "./DimensionStyle"
import "./DimensionType"
import type { DimensionFormat } from "./DimensionFormat"
import type { DimensionHeight } from "./DimensionHeight"
import type { DimensionLeaderLength } from "./DimensionLeaderLength"
import type { DimensionLocked } from "./DimensionLocked"
import type { DimensionOrientation } from "./DimensionOrientation"
import type { DimensionStyle } from "./DimensionStyle"
import type { DimensionType } from "./DimensionType"
import type { GrText } from "./GrText"
import type { Layer } from "./Layer"
import type { Pts } from "./Pts"
import type { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set([
  "locked",
  "type",
  "layer",
  "uuid",
  "pts",
  "height",
  "orientation",
  "leader_length",
  "gr_text",
  "format",
  "style",
])

export class Dimension extends SxClass {
  static override token = "dimension"
  static override parentToken = "kicad_pcb"
  token = "dimension"

  private _sxLocked?: DimensionLocked
  private _sxType?: DimensionType
  private _sxLayer?: Layer
  private _sxUuid?: Uuid
  private _sxPts?: Pts
  private _sxHeight?: DimensionHeight
  private _sxOrientation?: DimensionOrientation
  private _sxLeaderLength?: DimensionLeaderLength
  private _sxFormat?: DimensionFormat
  private _sxStyle?: DimensionStyle
  private _sxGrText?: GrText

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Dimension {
    const dimension = new Dimension()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`dimension does not support child token "${token}"`)
      }
      if (arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `dimension does not support repeated child token "${token}"`,
        )
      }
    }

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `dimension encountered unexpected primitive child ${JSON.stringify(primitive)}`,
        )
      }
    }

    dimension._sxLocked = propertyMap.locked as DimensionLocked | undefined
    dimension._sxType = propertyMap.type as DimensionType | undefined
    dimension._sxLayer = propertyMap.layer as Layer | undefined
    dimension._sxUuid = propertyMap.uuid as Uuid | undefined
    dimension._sxPts = propertyMap.pts as Pts | undefined
    dimension._sxHeight = propertyMap.height as DimensionHeight | undefined
    dimension._sxOrientation = propertyMap.orientation as
      | DimensionOrientation
      | undefined
    dimension._sxLeaderLength = propertyMap.leader_length as
      | DimensionLeaderLength
      | undefined
    dimension._sxFormat = propertyMap.format as DimensionFormat | undefined
    dimension._sxStyle = propertyMap.style as DimensionStyle | undefined
    dimension._sxGrText = propertyMap.gr_text as GrText | undefined

    if (!dimension._sxType) {
      throw new Error("dimension requires a type child token")
    }
    if (!dimension._sxLayer) {
      throw new Error("dimension requires a layer child token")
    }
    if (!dimension._sxUuid) {
      throw new Error("dimension requires a uuid child token")
    }
    if (!dimension._sxPts) {
      throw new Error("dimension requires a pts child token")
    }
    if (!dimension._sxStyle) {
      throw new Error("dimension requires a style child token")
    }

    return dimension
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxType) children.push(this._sxType)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxHeight) children.push(this._sxHeight)
    if (this._sxOrientation) children.push(this._sxOrientation)
    if (this._sxLeaderLength) children.push(this._sxLeaderLength)
    if (this._sxFormat) children.push(this._sxFormat)
    if (this._sxStyle) children.push(this._sxStyle)
    if (this._sxGrText) children.push(this._sxGrText)
    return children
  }
}
SxClass.register(Dimension)
