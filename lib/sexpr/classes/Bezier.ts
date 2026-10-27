import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Pts } from "./Pts"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import type { SymbolPolylineFillLike } from "./Polyline"

const SUPPORTED_TOKENS_KICAD_SCH = new Set(["pts", "stroke", "fill", "uuid"])
const SUPPORTED_TOKENS_SYMBOL = new Set(["pts", "stroke", "fill", "uuid"])

export interface BezierConstructorParams {
  points?: Pts
  stroke?: Stroke
  fill?: SymbolPolylineFillLike
  uuid?: string | Uuid
}

export class Bezier extends SxClass {
  static override token = "bezier"
  override token = "bezier"

  private _sxPts?: Pts
  private _sxStroke?: Stroke
  private _sxFill?: SymbolPolylineFillLike
  private _sxUuid?: Uuid

  constructor(params: BezierConstructorParams = {}) {
    super()

    if (params.points !== undefined) {
      this.points = params.points
    }

    if (params.stroke !== undefined) {
      this.stroke = params.stroke
    }

    if (params.fill !== undefined) {
      this.fill = params.fill
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Bezier {
    const bezier = new this()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    const supportedTokens =
      this.parentToken === "symbol"
        ? SUPPORTED_TOKENS_SYMBOL
        : SUPPORTED_TOKENS_KICAD_SCH

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!supportedTokens.has(token)) {
        throw new Error(
          `Unsupported child tokens inside bezier expression: ${token}`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `bezier does not support repeated child tokens: ${token}`,
        )
      }
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !supportedTokens.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside bezier expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    bezier._sxPts =
      (arrayPropertyMap.pts?.[0] as Pts | undefined) ??
      (propertyMap.pts as Pts | undefined)
    bezier._sxStroke = propertyMap.stroke as Stroke | undefined
    bezier._sxFill = propertyMap.fill as SymbolPolylineFillLike | undefined
    bezier._sxUuid = propertyMap.uuid as Uuid | undefined

    return bezier
  }

  get points(): Pts | undefined {
    return this._sxPts
  }

  set points(value: Pts | undefined) {
    this._sxPts = value
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get fill(): SymbolPolylineFillLike | undefined {
    return this._sxFill
  }

  set fill(value: SymbolPolylineFillLike | undefined) {
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
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}

SxClass.register(Bezier)

export class SchematicBezier extends Bezier {
  static override parentToken = "kicad_sch"
}
SxClass.register(SchematicBezier)

export class SymbolBezier extends Bezier {
  static override parentToken = "symbol"
}
SxClass.register(SymbolBezier)
