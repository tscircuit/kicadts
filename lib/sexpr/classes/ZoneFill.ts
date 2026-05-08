import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"
import { ZoneFillIslandAreaMin } from "./ZoneFillIslandAreaMin"
import { ZoneFillIslandRemovalMode } from "./ZoneFillIslandRemovalMode"
import { ZoneFillRadius } from "./ZoneFillRadius"
import { ZoneFillSmoothing } from "./ZoneFillSmoothing"
import { ZoneFillThermalBridgeWidth } from "./ZoneFillThermalBridgeWidth"
import { ZoneFillThermalGap } from "./ZoneFillThermalGap"

const SINGLE_TOKENS = new Set([
  "thermal_gap",
  "thermal_bridge_width",
  "smoothing",
  "radius",
  "island_removal_mode",
  "island_area_min",
])

export class ZoneFill extends SxClass {
  static override token = "fill"
  static override parentToken = "zone"
  override token = "fill"

  private _filled?: boolean
  private _sxThermalGap?: ZoneFillThermalGap
  private _sxThermalBridgeWidth?: ZoneFillThermalBridgeWidth
  private _sxSmoothing?: ZoneFillSmoothing
  private _sxRadius?: ZoneFillRadius
  private _sxIslandRemovalMode?: ZoneFillIslandRemovalMode
  private _sxIslandAreaMin?: ZoneFillIslandAreaMin

  constructor(
    params: {
      filled?: boolean
      thermalGap?: number
      thermalBridgeWidth?: number
      smoothing?: string
      radius?: number
      islandRemovalMode?: number
      islandAreaMin?: number
    } = {},
  ) {
    super()
    if (params.filled !== undefined) this.filled = params.filled
    if (params.thermalGap !== undefined) this.thermalGap = params.thermalGap
    if (params.thermalBridgeWidth !== undefined)
      this.thermalBridgeWidth = params.thermalBridgeWidth
    if (params.smoothing !== undefined) this.smoothing = params.smoothing
    if (params.radius !== undefined) this.radius = params.radius
    if (params.islandRemovalMode !== undefined)
      this.islandRemovalMode = params.islandRemovalMode
    if (params.islandAreaMin !== undefined)
      this.islandAreaMin = params.islandAreaMin
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneFill {
    const fill = new ZoneFill()
    const nodes: PrimitiveSExpr[] = []

    for (const primitive of primitiveSexprs) {
      const filled = parseYesNo(primitive)
      if (filled !== undefined) {
        fill.filled = filled
        continue
      }
      if (!Array.isArray(primitive) || typeof primitive[0] !== "string") {
        throw new Error(
          `zone fill encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }
      nodes.push(primitive)
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(nodes, this.token)

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SINGLE_TOKENS.has(token)) {
        throw new Error(`zone fill encountered unsupported child "${token}"`)
      }
      if (entries.length > 1) {
        throw new Error(`zone fill does not support repeated child "${token}"`)
      }
    }

    fill._sxThermalGap = propertyMap.thermal_gap as
      | ZoneFillThermalGap
      | undefined
    fill._sxThermalBridgeWidth = propertyMap.thermal_bridge_width as
      | ZoneFillThermalBridgeWidth
      | undefined
    fill._sxSmoothing = propertyMap.smoothing as ZoneFillSmoothing | undefined
    fill._sxRadius = propertyMap.radius as ZoneFillRadius | undefined
    fill._sxIslandRemovalMode = propertyMap.island_removal_mode as
      | ZoneFillIslandRemovalMode
      | undefined
    fill._sxIslandAreaMin = propertyMap.island_area_min as
      | ZoneFillIslandAreaMin
      | undefined

    return fill
  }

  get filled(): boolean | undefined {
    return this._filled
  }

  set filled(value: boolean | undefined) {
    this._filled = value
  }

  get thermalGap(): number | undefined {
    return this._sxThermalGap?.value
  }

  set thermalGap(value: ZoneFillThermalGap | number | undefined) {
    this._sxThermalGap =
      value === undefined
        ? undefined
        : value instanceof ZoneFillThermalGap
          ? value
          : new ZoneFillThermalGap(value)
  }

  get thermalBridgeWidth(): number | undefined {
    return this._sxThermalBridgeWidth?.value
  }

  set thermalBridgeWidth(value:
    | ZoneFillThermalBridgeWidth
    | number
    | undefined,) {
    this._sxThermalBridgeWidth =
      value === undefined
        ? undefined
        : value instanceof ZoneFillThermalBridgeWidth
          ? value
          : new ZoneFillThermalBridgeWidth(value)
  }

  get smoothing(): string | undefined {
    return this._sxSmoothing?.value
  }

  set smoothing(value: ZoneFillSmoothing | string | undefined) {
    this._sxSmoothing =
      value === undefined
        ? undefined
        : value instanceof ZoneFillSmoothing
          ? value
          : new ZoneFillSmoothing(value)
  }

  get radius(): number | undefined {
    return this._sxRadius?.value
  }

  set radius(value: ZoneFillRadius | number | undefined) {
    this._sxRadius =
      value === undefined
        ? undefined
        : value instanceof ZoneFillRadius
          ? value
          : new ZoneFillRadius(value)
  }

  get islandRemovalMode(): number | undefined {
    return this._sxIslandRemovalMode?.value
  }

  set islandRemovalMode(value: ZoneFillIslandRemovalMode | number | undefined) {
    this._sxIslandRemovalMode =
      value === undefined
        ? undefined
        : value instanceof ZoneFillIslandRemovalMode
          ? value
          : new ZoneFillIslandRemovalMode(value)
  }

  get islandAreaMin(): number | undefined {
    return this._sxIslandAreaMin?.value
  }

  set islandAreaMin(value: ZoneFillIslandAreaMin | number | undefined) {
    this._sxIslandAreaMin =
      value === undefined
        ? undefined
        : value instanceof ZoneFillIslandAreaMin
          ? value
          : new ZoneFillIslandAreaMin(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxThermalGap) children.push(this._sxThermalGap)
    if (this._sxThermalBridgeWidth) children.push(this._sxThermalBridgeWidth)
    if (this._sxSmoothing) children.push(this._sxSmoothing)
    if (this._sxRadius) children.push(this._sxRadius)
    if (this._sxIslandRemovalMode) children.push(this._sxIslandRemovalMode)
    if (this._sxIslandAreaMin) children.push(this._sxIslandAreaMin)
    return children
  }

  override getString(): string {
    if (this._filled === undefined) return super.getString()
    const children = this.getChildren()
    if (children.length === 0) {
      return `(fill ${this._filled ? "yes" : "no"})`
    }
    const lines = [`(fill ${this._filled ? "yes" : "no"}`]
    for (const child of children) lines.push(child.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(ZoneFill)
