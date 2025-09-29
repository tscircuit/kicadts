import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"

import { PcbPlotParams } from "./PcbPlotParams"
import {
  SetupAllowSoldermaskBridgesInFootprints,
  SetupTenting,
  SetupUviasAllowed,
  SetupVisibleElements,
  SetupZone45Only,
} from "./setupStringProperties"
import {
  SetupAuxAxisOrigin,
  SetupGridOrigin,
  SetupModTextSize,
  SetupPadSize,
  SetupPadToPasteClearanceValues,
  SetupPcbTextSize,
  SetupTraceWidth,
} from "./setupMultiValueProperties"
import {
  SetupEdgeWidth,
  SetupLastTraceWidth,
  SetupModEdgeWidth,
  SetupModTextWidth,
  SetupPadDrill,
  SetupPadToMaskClearance,
  SetupPadToPasteClearance,
  SetupPadToPasteClearanceRatio,
  SetupPcbTextWidth,
  SetupSegmentWidth,
  SetupSolderMaskMinWidth,
  SetupTraceClearance,
  SetupTraceMin,
  SetupUviaDrill,
  SetupUviaMinDrill,
  SetupUviaMinSize,
  SetupUviaSize,
  SetupViaDrill,
  SetupViaMinDrill,
  SetupViaMinSize,
  SetupViaSize,
  SetupZoneClearance,
} from "./setupNumericProperties"
import type { SetupPropertyValues } from "./SetupPropertyTypes"
import { Stackup } from "./Stackup"

const TOKEN_TO_KEY: Record<string, SetupPropertyKey> = {
  stackup: "stackup",
  pcbplotparams: "pcbPlotParams",
  pad_to_mask_clearance: "padToMaskClearance",
  solder_mask_min_width: "solderMaskMinWidth",
  pad_to_paste_clearance: "padToPasteClearance",
  pad_to_paste_clearance_ratio: "padToPasteClearanceRatio",
  last_trace_width: "lastTraceWidth",
  trace_clearance: "traceClearance",
  zone_clearance: "zoneClearance",
  zone_45_only: "zone45Only",
  trace_min: "traceMin",
  segment_width: "segmentWidth",
  edge_width: "edgeWidth",
  via_size: "viaSize",
  via_drill: "viaDrill",
  via_min_size: "viaMinSize",
  via_min_drill: "viaMinDrill",
  uvias_allowed: "uviasAllowed",
  uvia_size: "uviaSize",
  uvia_drill: "uviaDrill",
  uvia_min_size: "uviaMinSize",
  uvia_min_drill: "uviaMinDrill",
  pcb_text_width: "pcbTextWidth",
  pcb_text_size: "pcbTextSize",
  mod_edge_width: "modEdgeWidth",
  mod_text_size: "modTextSize",
  mod_text_width: "modTextWidth",
  pad_size: "padSize",
  pad_drill: "padDrill",
  allow_soldermask_bridges_in_footprints: "allowSoldermaskBridgesInFootprints",
  tenting: "tenting",
  aux_axis_origin: "auxAxisOrigin",
  grid_origin: "gridOrigin",
  visible_elements: "visibleElements",
  pad_to_paste_clearance_values: "padToPasteClearanceValues",
  trace_width: "traceWidth",
}

type SetupPropertyKey = keyof SetupPropertyValues

const SETUP_CHILD_ORDER: SetupPropertyKey[] = [
  "stackup",
  "padToMaskClearance",
  "solderMaskMinWidth",
  "padToPasteClearance",
  "padToPasteClearanceRatio",
  "lastTraceWidth",
  "traceClearance",
  "zoneClearance",
  "zone45Only",
  "traceMin",
  "segmentWidth",
  "edgeWidth",
  "viaSize",
  "viaDrill",
  "viaMinSize",
  "viaMinDrill",
  "uviaSize",
  "uviaDrill",
  "uviasAllowed",
  "uviaMinSize",
  "uviaMinDrill",
  "pcbTextWidth",
  "pcbTextSize",
  "modEdgeWidth",
  "modTextSize",
  "modTextWidth",
  "padSize",
  "padDrill",
  "allowSoldermaskBridgesInFootprints",
  "tenting",
  "auxAxisOrigin",
  "gridOrigin",
  "visibleElements",
  "padToPasteClearanceValues",
  "traceWidth",
  "pcbPlotParams",
]

type Coordinate = { x: number; y: number }

export class Setup extends SxClass {
  static override token = "setup"
  token = "setup"

  private _properties: Partial<Record<SetupPropertyKey, SxClass>> = {}

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Setup {
    const setup = new Setup()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    for (const [token, instance] of Object.entries(propertyMap)) {
      const key = TOKEN_TO_KEY[token]
      if (!key) {
        throw new Error(`Unsupported setup property token: ${token}`)
      }
      setup._properties[key] = instance
    }

    return setup
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    for (const key of SETUP_CHILD_ORDER) {
      const child = this._properties[key]
      if (child) {
        children.push(child)
      }
    }
    return children
  }

  private setProperty(key: SetupPropertyKey, instance: SxClass | undefined) {
    if (instance) {
      this._properties[key] = instance
      return
    }
    delete this._properties[key]
  }

  private setNumberProperty<T extends SxClass>(
    key: SetupPropertyKey,
    value: number | undefined,
    ClassRef: new (value: number) => T,
  ) {
    if (value === undefined) {
      delete this._properties[key]
      return
    }
    this._properties[key] = new ClassRef(value)
  }

  private getPropertyInstance<T extends SxClass>(
    key: SetupPropertyKey,
    ClassRef: new (...args: any[]) => T,
  ): T | undefined {
    const value = this._properties[key]
    return value instanceof ClassRef ? value : undefined
  }

  get stackup(): Stackup | undefined {
    return this.getPropertyInstance("stackup", Stackup)
  }

  set stackup(value: Stackup | undefined) {
    if (value !== undefined && !(value instanceof Stackup)) {
      throw new Error("stackup must be a Stackup instance")
    }
    this.setProperty("stackup", value)
  }

  get pcbPlotParams(): PcbPlotParams | undefined {
    return this.getPropertyInstance("pcbPlotParams", PcbPlotParams)
  }

  set pcbPlotParams(value: PcbPlotParams | undefined) {
    if (value !== undefined && !(value instanceof PcbPlotParams)) {
      throw new Error("pcbPlotParams must be a PcbPlotParams instance")
    }
    this.setProperty("pcbPlotParams", value)
  }

  get padToMaskClearance(): number | undefined {
    return this.getPropertyInstance(
      "padToMaskClearance",
      SetupPadToMaskClearance,
    )?.value
  }

  set padToMaskClearance(value: number | undefined) {
    this.setNumberProperty("padToMaskClearance", value, SetupPadToMaskClearance)
  }

  get solderMaskMinWidth(): number | undefined {
    return this.getPropertyInstance(
      "solderMaskMinWidth",
      SetupSolderMaskMinWidth,
    )?.value
  }

  set solderMaskMinWidth(value: number | undefined) {
    this.setNumberProperty("solderMaskMinWidth", value, SetupSolderMaskMinWidth)
  }

  get padToPasteClearance(): number | undefined {
    return this.getPropertyInstance(
      "padToPasteClearance",
      SetupPadToPasteClearance,
    )?.value
  }

  set padToPasteClearance(value: number | undefined) {
    this.setNumberProperty(
      "padToPasteClearance",
      value,
      SetupPadToPasteClearance,
    )
  }

  get padToPasteClearanceRatio(): number | undefined {
    return this.getPropertyInstance(
      "padToPasteClearanceRatio",
      SetupPadToPasteClearanceRatio,
    )?.value
  }

  set padToPasteClearanceRatio(value: number | undefined) {
    this.setNumberProperty(
      "padToPasteClearanceRatio",
      value,
      SetupPadToPasteClearanceRatio,
    )
  }

  get lastTraceWidth(): number | undefined {
    return this.getPropertyInstance("lastTraceWidth", SetupLastTraceWidth)
      ?.value
  }

  set lastTraceWidth(value: number | undefined) {
    this.setNumberProperty("lastTraceWidth", value, SetupLastTraceWidth)
  }

  get traceClearance(): number | undefined {
    return this.getPropertyInstance("traceClearance", SetupTraceClearance)
      ?.value
  }

  set traceClearance(value: number | undefined) {
    this.setNumberProperty("traceClearance", value, SetupTraceClearance)
  }

  get zoneClearance(): number | undefined {
    return this.getPropertyInstance("zoneClearance", SetupZoneClearance)?.value
  }

  set zoneClearance(value: number | undefined) {
    this.setNumberProperty("zoneClearance", value, SetupZoneClearance)
  }

  get zone45Only(): string | undefined {
    return this.getPropertyInstance("zone45Only", SetupZone45Only)?.value
  }

  set zone45Only(value: string | undefined) {
    this.setProperty(
      "zone45Only",
      value === undefined ? undefined : new SetupZone45Only(value),
    )
  }

  get traceMin(): number | undefined {
    return this.getPropertyInstance("traceMin", SetupTraceMin)?.value
  }

  set traceMin(value: number | undefined) {
    this.setNumberProperty("traceMin", value, SetupTraceMin)
  }

  get segmentWidth(): number | undefined {
    return this.getPropertyInstance("segmentWidth", SetupSegmentWidth)?.value
  }

  set segmentWidth(value: number | undefined) {
    this.setNumberProperty("segmentWidth", value, SetupSegmentWidth)
  }

  get edgeWidth(): number | undefined {
    return this.getPropertyInstance("edgeWidth", SetupEdgeWidth)?.value
  }

  set edgeWidth(value: number | undefined) {
    this.setNumberProperty("edgeWidth", value, SetupEdgeWidth)
  }

  get viaSize(): number | undefined {
    return this.getPropertyInstance("viaSize", SetupViaSize)?.value
  }

  set viaSize(value: number | undefined) {
    this.setNumberProperty("viaSize", value, SetupViaSize)
  }

  get viaDrill(): number | undefined {
    return this.getPropertyInstance("viaDrill", SetupViaDrill)?.value
  }

  set viaDrill(value: number | undefined) {
    this.setNumberProperty("viaDrill", value, SetupViaDrill)
  }

  get viaMinSize(): number | undefined {
    return this.getPropertyInstance("viaMinSize", SetupViaMinSize)?.value
  }

  set viaMinSize(value: number | undefined) {
    this.setNumberProperty("viaMinSize", value, SetupViaMinSize)
  }

  get viaMinDrill(): number | undefined {
    return this.getPropertyInstance("viaMinDrill", SetupViaMinDrill)?.value
  }

  set viaMinDrill(value: number | undefined) {
    this.setNumberProperty("viaMinDrill", value, SetupViaMinDrill)
  }

  get uviasAllowed(): string | undefined {
    return this.getPropertyInstance("uviasAllowed", SetupUviasAllowed)?.value
  }

  set uviasAllowed(value: string | undefined) {
    this.setProperty(
      "uviasAllowed",
      value === undefined ? undefined : new SetupUviasAllowed(value),
    )
  }

  get uviaSize(): number | undefined {
    return this.getPropertyInstance("uviaSize", SetupUviaSize)?.value
  }

  set uviaSize(value: number | undefined) {
    this.setNumberProperty("uviaSize", value, SetupUviaSize)
  }

  get uviaDrill(): number | undefined {
    return this.getPropertyInstance("uviaDrill", SetupUviaDrill)?.value
  }

  set uviaDrill(value: number | undefined) {
    this.setNumberProperty("uviaDrill", value, SetupUviaDrill)
  }

  get uviaMinSize(): number | undefined {
    return this.getPropertyInstance("uviaMinSize", SetupUviaMinSize)?.value
  }

  set uviaMinSize(value: number | undefined) {
    this.setNumberProperty("uviaMinSize", value, SetupUviaMinSize)
  }

  get uviaMinDrill(): number | undefined {
    return this.getPropertyInstance("uviaMinDrill", SetupUviaMinDrill)?.value
  }

  set uviaMinDrill(value: number | undefined) {
    this.setNumberProperty("uviaMinDrill", value, SetupUviaMinDrill)
  }

  get pcbTextWidth(): number | undefined {
    return this.getPropertyInstance("pcbTextWidth", SetupPcbTextWidth)?.value
  }

  set pcbTextWidth(value: number | undefined) {
    this.setNumberProperty("pcbTextWidth", value, SetupPcbTextWidth)
  }

  get pcbTextSize(): number[] | undefined {
    return this.getPropertyInstance("pcbTextSize", SetupPcbTextSize)?.values
  }

  set pcbTextSize(values: number[] | undefined) {
    if (values === undefined) {
      delete this._properties.pcbTextSize
      return
    }
    this.setProperty("pcbTextSize", new SetupPcbTextSize(values))
  }

  get modEdgeWidth(): number | undefined {
    return this.getPropertyInstance("modEdgeWidth", SetupModEdgeWidth)?.value
  }

  set modEdgeWidth(value: number | undefined) {
    this.setNumberProperty("modEdgeWidth", value, SetupModEdgeWidth)
  }

  get modTextSize(): number[] | undefined {
    return this.getPropertyInstance("modTextSize", SetupModTextSize)?.values
  }

  set modTextSize(values: number[] | undefined) {
    if (values === undefined) {
      delete this._properties.modTextSize
      return
    }
    this.setProperty("modTextSize", new SetupModTextSize(values))
  }

  get modTextWidth(): number | undefined {
    return this.getPropertyInstance("modTextWidth", SetupModTextWidth)?.value
  }

  set modTextWidth(value: number | undefined) {
    this.setNumberProperty("modTextWidth", value, SetupModTextWidth)
  }

  get padSize(): number[] | undefined {
    return this.getPropertyInstance("padSize", SetupPadSize)?.values
  }

  set padSize(values: number[] | undefined) {
    if (values === undefined) {
      delete this._properties.padSize
      return
    }
    this.setProperty("padSize", new SetupPadSize(values))
  }

  get padDrill(): number | undefined {
    return this.getPropertyInstance("padDrill", SetupPadDrill)?.value
  }

  set padDrill(value: number | undefined) {
    this.setNumberProperty("padDrill", value, SetupPadDrill)
  }

  get allowSoldermaskBridgesInFootprints(): string | undefined {
    return this.getPropertyInstance(
      "allowSoldermaskBridgesInFootprints",
      SetupAllowSoldermaskBridgesInFootprints,
    )?.value
  }

  set allowSoldermaskBridgesInFootprints(value: string | undefined) {
    this.setProperty(
      "allowSoldermaskBridgesInFootprints",
      value === undefined
        ? undefined
        : new SetupAllowSoldermaskBridgesInFootprints(value),
    )
  }

  get tenting(): string[] | undefined {
    return this.getPropertyInstance("tenting", SetupTenting)?.sides
  }

  set tenting(sides: string[] | undefined) {
    if (sides === undefined) {
      delete this._properties.tenting
      return
    }
    this.setProperty("tenting", new SetupTenting(sides))
  }

  get auxAxisOrigin(): Coordinate | undefined {
    const origin = this.getPropertyInstance("auxAxisOrigin", SetupAuxAxisOrigin)
    if (!origin) return undefined
    return { x: origin.x, y: origin.y }
  }

  set auxAxisOrigin(origin: Coordinate | undefined) {
    if (!origin) {
      delete this._properties.auxAxisOrigin
      return
    }
    this.setProperty(
      "auxAxisOrigin",
      new SetupAuxAxisOrigin(origin.x, origin.y),
    )
  }

  get gridOrigin(): Coordinate | undefined {
    const origin = this.getPropertyInstance("gridOrigin", SetupGridOrigin)
    if (!origin) return undefined
    return { x: origin.x, y: origin.y }
  }

  set gridOrigin(origin: Coordinate | undefined) {
    if (!origin) {
      delete this._properties.gridOrigin
      return
    }
    this.setProperty("gridOrigin", new SetupGridOrigin(origin.x, origin.y))
  }

  get visibleElements(): string | undefined {
    return this.getPropertyInstance("visibleElements", SetupVisibleElements)
      ?.value
  }

  set visibleElements(value: string | undefined) {
    this.setProperty(
      "visibleElements",
      value === undefined ? undefined : new SetupVisibleElements(value),
    )
  }

  get padToPasteClearanceValues(): number[] | undefined {
    return this.getPropertyInstance(
      "padToPasteClearanceValues",
      SetupPadToPasteClearanceValues,
    )?.values
  }

  set padToPasteClearanceValues(values: number[] | undefined) {
    if (values === undefined) {
      delete this._properties.padToPasteClearanceValues
      return
    }
    this.setProperty(
      "padToPasteClearanceValues",
      new SetupPadToPasteClearanceValues(values),
    )
  }

  get traceWidth(): number[] | undefined {
    return this.getPropertyInstance("traceWidth", SetupTraceWidth)?.values
  }

  set traceWidth(values: number[] | undefined) {
    if (values === undefined) {
      delete this._properties.traceWidth
      return
    }
    this.setProperty("traceWidth", new SetupTraceWidth(values))
  }
}
SxClass.register(Setup)
