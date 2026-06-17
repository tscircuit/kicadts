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

export interface SchematicRectanglePoint {
  x: number
  y: number
}

export interface SchematicRectangleConstructorParams {
  start?: SymbolRectangleStart | SchematicRectanglePoint
  end?: SymbolRectangleEnd | SchematicRectanglePoint
  stroke?: Stroke
  fill?: SymbolRectangleFill
  uuid?: string | Uuid
}

export class SchematicRectangle extends SxClass {
  static override token = "rectangle"
  static override parentToken = "kicad_sch"
  override token = "rectangle"

  private _sxStart?: SymbolRectangleStart
  private _sxEnd?: SymbolRectangleEnd
  private _sxStroke?: Stroke
  private _sxFill?: SymbolRectangleFill
  private _sxUuid?: Uuid

  constructor(params: SchematicRectangleConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.end !== undefined) this.end = params.end
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.fill !== undefined) this.fill = params.fill
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

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

  get start(): SymbolRectangleStart | undefined {
    return this._sxStart
  }

  set start(value: SymbolRectangleStart | SchematicRectanglePoint | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    this._sxStart =
      value instanceof SymbolRectangleStart
        ? value
        : new SymbolRectangleStart(value.x, value.y)
  }

  get end(): SymbolRectangleEnd | undefined {
    return this._sxEnd
  }

  set end(value: SymbolRectangleEnd | SchematicRectanglePoint | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    this._sxEnd =
      value instanceof SymbolRectangleEnd
        ? value
        : new SymbolRectangleEnd(value.x, value.y)
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get fill(): SymbolRectangleFill | undefined {
    return this._sxFill
  }

  set fill(value: SymbolRectangleFill | undefined) {
    this._sxFill = value
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
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
