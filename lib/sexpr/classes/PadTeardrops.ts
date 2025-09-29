import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { parseYesNo } from "../utils/parseYesNo"

const NUMERIC_TOKENS = new Map<string, keyof PadTeardrops>([
  ["best_length_ratio", "bestLengthRatio"],
  ["max_length", "maxLength"],
  ["best_width_ratio", "bestWidthRatio"],
  ["max_width", "maxWidth"],
  ["filter_ratio", "filterRatio"],
])

const BOOLEAN_TOKENS = new Map<string, keyof PadTeardrops>([
  ["curved_edges", "curvedEdges"],
  ["enabled", "enabled"],
  ["allow_two_segments", "allowTwoSegments"],
  ["prefer_zone_connections", "preferZoneConnections"],
])

export class PadTeardrops extends SxClass {
  static override token = "teardrops"
  static override parentToken = "pad"
  override token = "teardrops"

  private _bestLengthRatio?: number
  private _maxLength?: number
  private _bestWidthRatio?: number
  private _maxWidth?: number
  private _filterRatio?: number
  private _curvedEdges?: boolean
  private _enabled?: boolean
  private _allowTwoSegments?: boolean
  private _preferZoneConnections?: boolean

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadTeardrops {
    const teardrops = new PadTeardrops()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `teardrops encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }
      const [rawToken, rawValue] = primitive
      if (typeof rawToken !== "string") {
        throw new Error(
          `teardrops encountered non-string token: ${JSON.stringify(rawToken)}`,
        )
      }

      if (NUMERIC_TOKENS.has(rawToken)) {
        const property = NUMERIC_TOKENS.get(rawToken)!
        const numeric = toNumberValue(rawValue)
        if (numeric === undefined) {
          throw new Error(
            `teardrops ${rawToken} expects a numeric value, received ${JSON.stringify(rawValue)}`,
          )
        }
        teardrops[property] = numeric
        continue
      }

      if (BOOLEAN_TOKENS.has(rawToken)) {
        const property = BOOLEAN_TOKENS.get(rawToken)!
        const booleanValue = parseYesNo(rawValue)
        if (booleanValue === undefined) {
          throw new Error(
            `teardrops ${rawToken} expects yes/no, received ${JSON.stringify(rawValue)}`,
          )
        }
        teardrops[property] = booleanValue
        continue
      }

      throw new Error(`teardrops encountered unsupported token "${rawToken}"`)
    }

    return teardrops
  }

  get bestLengthRatio(): number | undefined {
    return this._bestLengthRatio
  }

  set bestLengthRatio(value: number | undefined) {
    this._bestLengthRatio = value
  }

  get maxLength(): number | undefined {
    return this._maxLength
  }

  set maxLength(value: number | undefined) {
    this._maxLength = value
  }

  get bestWidthRatio(): number | undefined {
    return this._bestWidthRatio
  }

  set bestWidthRatio(value: number | undefined) {
    this._bestWidthRatio = value
  }

  get maxWidth(): number | undefined {
    return this._maxWidth
  }

  set maxWidth(value: number | undefined) {
    this._maxWidth = value
  }

  get filterRatio(): number | undefined {
    return this._filterRatio
  }

  set filterRatio(value: number | undefined) {
    this._filterRatio = value
  }

  get curvedEdges(): boolean | undefined {
    return this._curvedEdges
  }

  set curvedEdges(value: boolean | undefined) {
    this._curvedEdges = value
  }

  get enabled(): boolean | undefined {
    return this._enabled
  }

  set enabled(value: boolean | undefined) {
    this._enabled = value
  }

  get allowTwoSegments(): boolean | undefined {
    return this._allowTwoSegments
  }

  set allowTwoSegments(value: boolean | undefined) {
    this._allowTwoSegments = value
  }

  get preferZoneConnections(): boolean | undefined {
    return this._preferZoneConnections
  }

  set preferZoneConnections(value: boolean | undefined) {
    this._preferZoneConnections = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const lines = ["(teardrops"]
    if (this._bestLengthRatio !== undefined) {
      lines.push(`  (best_length_ratio ${this._bestLengthRatio})`)
    }
    if (this._maxLength !== undefined) {
      lines.push(`  (max_length ${this._maxLength})`)
    }
    if (this._bestWidthRatio !== undefined) {
      lines.push(`  (best_width_ratio ${this._bestWidthRatio})`)
    }
    if (this._maxWidth !== undefined) {
      lines.push(`  (max_width ${this._maxWidth})`)
    }
    if (this._curvedEdges !== undefined) {
      lines.push(`  (curved_edges ${this._curvedEdges ? "yes" : "no"})`)
    }
    if (this._filterRatio !== undefined) {
      lines.push(`  (filter_ratio ${this._filterRatio})`)
    }
    if (this._enabled !== undefined) {
      lines.push(`  (enabled ${this._enabled ? "yes" : "no"})`)
    }
    if (this._allowTwoSegments !== undefined) {
      lines.push(`  (allow_two_segments ${this._allowTwoSegments ? "yes" : "no"})`)
    }
    if (this._preferZoneConnections !== undefined) {
      lines.push(
        `  (prefer_zone_connections ${this._preferZoneConnections ? "yes" : "no"})`,
      )
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PadTeardrops)
