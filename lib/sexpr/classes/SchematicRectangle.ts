import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Stroke } from "./Stroke"
import {
  SymbolRectangleEnd,
  SymbolRectangleFill,
  SymbolRectangleStart,
} from "./Symbol"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set(["start", "end", "stroke", "fill", "uuid"])

export class SchematicRectangle extends SxClass {
  static override token = "rectangle"
  static override parentToken = "kicad_sch"
  override token = "rectangle"

  private _sxStart?: SymbolRectangleStart
  private _sxEnd?: SymbolRectangleEnd
  private _sxStroke?: Stroke
  private _sxFill?: SymbolRectangleFill
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicRectangle {
    const rectangle = new SchematicRectangle()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `rectangle encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `rectangle does not support repeated child token "${token}"`,
        )
      }
    }

    rectangle._sxStart = propertyMap.start as SymbolRectangleStart | undefined
    rectangle._sxEnd = propertyMap.end as SymbolRectangleEnd | undefined
    rectangle._sxStroke = propertyMap.stroke as Stroke | undefined
    rectangle._sxFill = propertyMap.fill as SymbolRectangleFill | undefined
    rectangle._sxUuid = propertyMap.uuid as Uuid | undefined
    return rectangle
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(SchematicRectangle)
