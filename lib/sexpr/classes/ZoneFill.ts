import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"
import { ZoneFillHatchBorderAlgorithm } from "./ZoneFillHatchBorderAlgorithm"
import { ZoneFillHatchGap } from "./ZoneFillHatchGap"
import { ZoneFillHatchMinHoleArea } from "./ZoneFillHatchMinHoleArea"
import { ZoneFillHatchOrientation } from "./ZoneFillHatchOrientation"
import { ZoneFillHatchThickness } from "./ZoneFillHatchThickness"
import { ZoneFillIslandAreaMin } from "./ZoneFillIslandAreaMin"
import { ZoneFillIslandRemovalMode } from "./ZoneFillIslandRemovalMode"
import { ZoneFillMode } from "./ZoneFillMode"
import { ZoneFillRadius } from "./ZoneFillRadius"
import { ZoneFillSmoothing } from "./ZoneFillSmoothing"
import { ZoneFillThermalBridgeWidth } from "./ZoneFillThermalBridgeWidth"
import { ZoneFillThermalGap } from "./ZoneFillThermalGap"

const SINGLE_TOKENS = new Set([
  "mode",
  "hatch_thickness",
  "hatch_gap",
  "hatch_orientation",
  "hatch_border_algorithm",
  "hatch_min_hole_area",
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
  private _sxMode?: ZoneFillMode
  private _sxHatchThickness?: ZoneFillHatchThickness
  private _sxHatchGap?: ZoneFillHatchGap
  private _sxHatchOrientation?: ZoneFillHatchOrientation
  private _sxHatchBorderAlgorithm?: ZoneFillHatchBorderAlgorithm
  private _sxHatchMinHoleArea?: ZoneFillHatchMinHoleArea
  private _sxThermalGap?: ZoneFillThermalGap
  private _sxThermalBridgeWidth?: ZoneFillThermalBridgeWidth
  private _sxSmoothing?: ZoneFillSmoothing
  private _sxRadius?: ZoneFillRadius
  private _sxIslandRemovalMode?: ZoneFillIslandRemovalMode
  private _sxIslandAreaMin?: ZoneFillIslandAreaMin

  constructor(
    params: {
      filled?: boolean
      mode?: string
      hatchThickness?: number
      hatchGap?: number
      hatchOrientation?: number
      hatchBorderAlgorithm?: string
      hatchMinHoleArea?: number
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
    if (params.mode !== undefined) this.mode = params.mode
    if (params.hatchThickness !== undefined)
      this.hatchThickness = params.hatchThickness
    if (params.hatchGap !== undefined) this.hatchGap = params.hatchGap
    if (params.hatchOrientation !== undefined)
      this.hatchOrientation = params.hatchOrientation
    if (params.hatchBorderAlgorithm !== undefined)
      this.hatchBorderAlgorithm = params.hatchBorderAlgorithm
    if (params.hatchMinHoleArea !== undefined)
      this.hatchMinHoleArea = params.hatchMinHoleArea
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

    fill._sxMode = propertyMap.mode as ZoneFillMode | undefined
    fill._sxHatchThickness = propertyMap.hatch_thickness as
      | ZoneFillHatchThickness
      | undefined
    fill._sxHatchGap = propertyMap.hatch_gap as ZoneFillHatchGap | undefined
    fill._sxHatchOrientation = propertyMap.hatch_orientation as
      | ZoneFillHatchOrientation
      | undefined
    fill._sxHatchBorderAlgorithm = propertyMap.hatch_border_algorithm as
      | ZoneFillHatchBorderAlgorithm
      | undefined
    fill._sxHatchMinHoleArea = propertyMap.hatch_min_hole_area as
      | ZoneFillHatchMinHoleArea
      | undefined

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

  get mode(): string | undefined {
    return this._sxMode?.value
  }

  set mode(value: ZoneFillMode | string | undefined) {
    if (value === undefined) {
      this._sxMode = undefined
    } else if (value instanceof ZoneFillMode) {
      this._sxMode = value
    } else {
      this._sxMode = new ZoneFillMode(value)
    }
  }

  get hatchThickness(): number | undefined {
    return this._sxHatchThickness?.value
  }

  set hatchThickness(value: ZoneFillHatchThickness | number | undefined) {
    if (value === undefined) {
      this._sxHatchThickness = undefined
    } else if (value instanceof ZoneFillHatchThickness) {
      this._sxHatchThickness = value
    } else {
      this._sxHatchThickness = new ZoneFillHatchThickness(value)
    }
  }

  get hatchGap(): number | undefined {
    return this._sxHatchGap?.value
  }

  set hatchGap(value: ZoneFillHatchGap | number | undefined) {
    if (value === undefined) {
      this._sxHatchGap = undefined
    } else if (value instanceof ZoneFillHatchGap) {
      this._sxHatchGap = value
    } else {
      this._sxHatchGap = new ZoneFillHatchGap(value)
    }
  }

  get hatchOrientation(): number | undefined {
    return this._sxHatchOrientation?.value
  }

  set hatchOrientation(value: ZoneFillHatchOrientation | number | undefined) {
    if (value === undefined) {
      this._sxHatchOrientation = undefined
    } else if (value instanceof ZoneFillHatchOrientation) {
      this._sxHatchOrientation = value
    } else {
      this._sxHatchOrientation = new ZoneFillHatchOrientation(value)
    }
  }

  get hatchBorderAlgorithm(): string | undefined {
    return this._sxHatchBorderAlgorithm?.value
  }

  set hatchBorderAlgorithm(value:
    | ZoneFillHatchBorderAlgorithm
    | string
    | undefined) {
    if (value === undefined) {
      this._sxHatchBorderAlgorithm = undefined
    } else if (value instanceof ZoneFillHatchBorderAlgorithm) {
      this._sxHatchBorderAlgorithm = value
    } else {
      this._sxHatchBorderAlgorithm = new ZoneFillHatchBorderAlgorithm(value)
    }
  }

  get hatchMinHoleArea(): number | undefined {
    return this._sxHatchMinHoleArea?.value
  }

  set hatchMinHoleArea(value: ZoneFillHatchMinHoleArea | number | undefined) {
    if (value === undefined) {
      this._sxHatchMinHoleArea = undefined
    } else if (value instanceof ZoneFillHatchMinHoleArea) {
      this._sxHatchMinHoleArea = value
    } else {
      this._sxHatchMinHoleArea = new ZoneFillHatchMinHoleArea(value)
    }
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
    if (this._sxMode) children.push(this._sxMode)
    if (this._sxHatchThickness) children.push(this._sxHatchThickness)
    if (this._sxHatchGap) children.push(this._sxHatchGap)
    if (this._sxHatchOrientation) children.push(this._sxHatchOrientation)
    if (this._sxHatchBorderAlgorithm)
      children.push(this._sxHatchBorderAlgorithm)
    if (this._sxHatchMinHoleArea) children.push(this._sxHatchMinHoleArea)
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
