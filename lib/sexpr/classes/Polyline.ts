import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Pts } from "./Pts"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS_KICAD_SCH = new Set(["pts", "stroke", "uuid"])
const SUPPORTED_TOKENS_SYMBOL = new Set(["pts", "stroke", "fill"])

// Forward declaration for SymbolPolylineFill to avoid circular dependency
export interface SymbolPolylineFillLike extends SxClass {
  type?: string
}

export interface PolylineConstructorParams {
  points?: Pts
  stroke?: Stroke
  uuid?: string | Uuid
  fill?: SymbolPolylineFillLike
}

/**
 * Base Polyline class that can be used in both kicad_sch and symbol contexts.
 * - When parent is "kicad_sch": supports pts, stroke, uuid
 * - When parent is "symbol": supports pts, stroke, fill
 */
export class Polyline extends SxClass {
  static override token = "polyline"
  override token = "polyline"

  private _sxPts?: Pts
  private _sxStroke?: Stroke
  private _sxUuid?: Uuid
  private _sxFill?: SymbolPolylineFillLike

  constructor(params: PolylineConstructorParams = {}) {
    super()

    if (params.points !== undefined) {
      this.points = params.points
    }

    if (params.stroke !== undefined) {
      this.stroke = params.stroke
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }

    if (params.fill !== undefined) {
      this.fill = params.fill
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Polyline {
    const polyline = new Polyline()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    // Determine which tokens are supported based on parent context
    // Check the static parentToken property of the class being instantiated
    const supportedTokens =
      this.parentToken === "symbol"
        ? SUPPORTED_TOKENS_SYMBOL
        : SUPPORTED_TOKENS_KICAD_SCH

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!supportedTokens.has(token)) {
        throw new Error(
          `Unsupported child tokens inside polyline expression: ${token}`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `polyline does not support repeated child tokens: ${token}`,
        )
      }
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !supportedTokens.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside polyline expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    polyline._sxPts =
      (arrayPropertyMap.pts?.[0] as Pts | undefined) ??
      (propertyMap.pts as Pts | undefined)
    polyline._sxStroke = propertyMap.stroke as Stroke | undefined
    polyline._sxUuid = propertyMap.uuid as Uuid | undefined
    polyline._sxFill = propertyMap.fill

    return polyline
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

  get fill(): SymbolPolylineFillLike | undefined {
    return this._sxFill
  }

  set fill(value: SymbolPolylineFillLike | undefined) {
    this._sxFill = value
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

// Register for both kicad_sch and symbol parents
SxClass.register(Polyline)

// Create a class that explicitly sets parentToken for kicad_sch
export class SchematicPolyline extends Polyline {
  static override parentToken = "kicad_sch"
}
SxClass.register(SchematicPolyline)

// Create a class that explicitly sets parentToken for symbol
export class SymbolPolyline extends Polyline {
  static override parentToken = "symbol"
}
SxClass.register(SymbolPolyline)
