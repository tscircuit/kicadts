import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Layers } from "./Layers"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { ZoneAttr } from "./ZoneAttr"
import { ZoneConnectPads } from "./ZoneConnectPads"
import { ZoneFill } from "./ZoneFill"
import { ZoneFilledAreasThickness } from "./ZoneFilledAreasThickness"
import { ZoneFilledPolygon } from "./ZoneFilledPolygon"
import { ZoneHatch } from "./ZoneHatch"
import { ZoneKeepout } from "./ZoneKeepout"
import { ZoneMinThickness } from "./ZoneMinThickness"
import { ZoneName } from "./ZoneName"
import { ZoneNet } from "./ZoneNet"
import { ZoneNetName } from "./ZoneNetName"
import { ZonePlacement } from "./ZonePlacement"
import { ZonePolygon } from "./ZonePolygon"
import { ZonePriority } from "./ZonePriority"

import "./ZoneAttr"
import "./ZoneAttrTeardrop"
import "./ZoneAttrTeardropType"
import "./ZoneConnectPads"
import "./ZoneConnectPadsClearance"
import "./ZoneFill"
import "./ZoneFillIslandAreaMin"
import "./ZoneFillIslandRemovalMode"
import "./ZoneFillRadius"
import "./ZoneFillSmoothing"
import "./ZoneFillThermalBridgeWidth"
import "./ZoneFillThermalGap"
import "./ZoneFilledAreasThickness"
import "./ZoneFilledPolygon"
import "./ZoneHatch"
import "./ZoneKeepout"
import "./ZoneKeepoutCopperpour"
import "./ZoneKeepoutFootprints"
import "./ZoneKeepoutPads"
import "./ZoneKeepoutTracks"
import "./ZoneKeepoutVias"
import "./ZoneMinThickness"
import "./ZoneName"
import "./ZoneNet"
import "./ZoneNetName"
import "./ZonePlacement"
import "./ZonePlacementEnabled"
import "./ZonePlacementSheetname"
import "./ZonePolygon"
import "./ZonePriority"

const SINGLE_TOKENS = new Set([
  "net",
  "net_name",
  "layer",
  "layers",
  "tstamp",
  "uuid",
  "name",
  "hatch",
  "priority",
  "attr",
  "connect_pads",
  "min_thickness",
  "filled_areas_thickness",
  "keepout",
  "placement",
  "fill",
])

const MULTI_TOKENS = new Set(["polygon", "filled_polygon"])
const SUPPORTED_TOKENS = new Set([...SINGLE_TOKENS, ...MULTI_TOKENS])

export interface ZoneConstructorParams {
  net?: ZoneNet | number | string
  netName?: ZoneNetName | string
  layer?: Layer | string | string[]
  layers?: Layers | string[]
  tstamp?: Tstamp | string
  uuid?: Uuid | string
  name?: ZoneName | string
  hatch?: ZoneHatch
  priority?: ZonePriority | number
  attr?: ZoneAttr
  connectPads?: ZoneConnectPads
  minThickness?: ZoneMinThickness | number
  filledAreasThickness?: ZoneFilledAreasThickness | boolean
  keepout?: ZoneKeepout
  placement?: ZonePlacement
  fill?: ZoneFill
  polygons?: ZonePolygon[]
  filledPolygons?: ZoneFilledPolygon[]
}

export class Zone extends SxClass {
  static override token = "zone"
  token = "zone"

  private _sxNet?: ZoneNet
  private _sxNetName?: ZoneNetName
  private _sxLayer?: Layer
  private _sxLayers?: Layers
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid
  private _sxName?: ZoneName
  private _sxHatch?: ZoneHatch
  private _sxPriority?: ZonePriority
  private _sxAttr?: ZoneAttr
  private _sxConnectPads?: ZoneConnectPads
  private _sxMinThickness?: ZoneMinThickness
  private _sxFilledAreasThickness?: ZoneFilledAreasThickness
  private _sxKeepout?: ZoneKeepout
  private _sxPlacement?: ZonePlacement
  private _sxFill?: ZoneFill
  private _polygons: ZonePolygon[] = []
  private _filledPolygons: ZoneFilledPolygon[] = []

  constructor(params: ZoneConstructorParams = {}) {
    super()
    if (params.net !== undefined) this.net = params.net
    if (params.netName !== undefined) this.netName = params.netName
    if (params.layer !== undefined) this.layer = params.layer
    if (params.layers !== undefined) this.layers = params.layers
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.name !== undefined) this.name = params.name
    if (params.hatch !== undefined) this.hatch = params.hatch
    if (params.priority !== undefined) this.priority = params.priority
    if (params.attr !== undefined) this.attr = params.attr
    if (params.connectPads !== undefined) this.connectPads = params.connectPads
    if (params.minThickness !== undefined)
      this.minThickness = params.minThickness
    if (params.filledAreasThickness !== undefined)
      this.filledAreasThickness = params.filledAreasThickness
    if (params.keepout !== undefined) this.keepout = params.keepout
    if (params.placement !== undefined) this.placement = params.placement
    if (params.fill !== undefined) this.fill = params.fill
    if (params.polygons !== undefined) this.polygons = params.polygons
    if (params.filledPolygons !== undefined)
      this.filledPolygons = params.filledPolygons
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Zone {
    const zone = new Zone()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || typeof primitive[0] !== "string") {
        throw new Error(
          `zone encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`zone encountered unsupported child token "${token}"`)
      }
      if (!MULTI_TOKENS.has(token) && entries.length > 1) {
        throw new Error(`zone does not support repeated child token "${token}"`)
      }
    }

    zone._sxNet = propertyMap.net as ZoneNet | undefined
    zone._sxNetName = propertyMap.net_name as ZoneNetName | undefined
    zone._sxLayer = propertyMap.layer as Layer | undefined
    zone._sxLayers = propertyMap.layers as Layers | undefined
    if (zone._sxLayer && zone._sxLayers) {
      throw new Error("zone cannot include both layer and layers children")
    }
    zone._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    zone._sxUuid = propertyMap.uuid as Uuid | undefined
    zone._sxName = propertyMap.name as ZoneName | undefined
    zone._sxHatch = propertyMap.hatch as ZoneHatch | undefined
    zone._sxPriority = propertyMap.priority as ZonePriority | undefined
    zone._sxAttr = propertyMap.attr as ZoneAttr | undefined
    zone._sxConnectPads = propertyMap.connect_pads as
      | ZoneConnectPads
      | undefined
    zone._sxMinThickness = propertyMap.min_thickness as
      | ZoneMinThickness
      | undefined
    zone._sxFilledAreasThickness = propertyMap.filled_areas_thickness as
      | ZoneFilledAreasThickness
      | undefined
    zone._sxKeepout = propertyMap.keepout as ZoneKeepout | undefined
    zone._sxPlacement = propertyMap.placement as ZonePlacement | undefined
    zone._sxFill = propertyMap.fill as ZoneFill | undefined
    zone._polygons = (arrayPropertyMap.polygon as ZonePolygon[]) ?? []
    zone._filledPolygons =
      (arrayPropertyMap.filled_polygon as ZoneFilledPolygon[]) ?? []

    return zone
  }

  get net(): number | string | undefined {
    return this._sxNet?.value
  }

  set net(value: ZoneNet | number | string | undefined) {
    this._sxNet =
      value === undefined
        ? undefined
        : value instanceof ZoneNet
          ? value
          : new ZoneNet(value)
  }

  get netClass(): ZoneNet | undefined {
    return this._sxNet
  }

  get netName(): string | undefined {
    return this._sxNetName?.value
  }

  set netName(value: ZoneNetName | string | undefined) {
    this._sxNetName =
      value === undefined
        ? undefined
        : value instanceof ZoneNetName
          ? value
          : new ZoneNetName(value)
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | string | string[] | undefined) {
    if (value === undefined) {
      this._sxLayer = undefined
      return
    }
    this._sxLayer = value instanceof Layer ? value : new Layer([value].flat())
    this._sxLayers = undefined
  }

  get layers(): Layers | undefined {
    return this._sxLayers
  }

  set layers(value: Layers | string[] | undefined) {
    if (value === undefined) {
      this._sxLayers = undefined
      return
    }
    this._sxLayers = value instanceof Layers ? value : new Layers(value)
    this._sxLayer = undefined
  }

  get tstamp(): Tstamp | undefined {
    return this._sxTstamp
  }

  set tstamp(value: Tstamp | string | undefined) {
    this._sxTstamp =
      value === undefined
        ? undefined
        : value instanceof Tstamp
          ? value
          : new Tstamp(value)
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    this._sxUuid =
      value === undefined
        ? undefined
        : value instanceof Uuid
          ? value
          : new Uuid(value)
  }

  get name(): string | undefined {
    return this._sxName?.value
  }

  set name(value: ZoneName | string | undefined) {
    this._sxName =
      value === undefined
        ? undefined
        : value instanceof ZoneName
          ? value
          : new ZoneName(value)
  }

  get hatch(): ZoneHatch | undefined {
    return this._sxHatch
  }

  set hatch(value: ZoneHatch | undefined) {
    this._sxHatch = value
  }

  get priority(): number | undefined {
    return this._sxPriority?.value
  }

  set priority(value: ZonePriority | number | undefined) {
    this._sxPriority =
      value === undefined
        ? undefined
        : value instanceof ZonePriority
          ? value
          : new ZonePriority(value)
  }

  get attr(): ZoneAttr | undefined {
    return this._sxAttr
  }

  set attr(value: ZoneAttr | undefined) {
    this._sxAttr = value
  }

  get connectPads(): ZoneConnectPads | undefined {
    return this._sxConnectPads
  }

  set connectPads(value: ZoneConnectPads | undefined) {
    this._sxConnectPads = value
  }

  get minThickness(): number | undefined {
    return this._sxMinThickness?.value
  }

  set minThickness(value: ZoneMinThickness | number | undefined) {
    this._sxMinThickness =
      value === undefined
        ? undefined
        : value instanceof ZoneMinThickness
          ? value
          : new ZoneMinThickness(value)
  }

  get filledAreasThickness(): boolean | undefined {
    return this._sxFilledAreasThickness?.value
  }

  set filledAreasThickness(value:
    | ZoneFilledAreasThickness
    | boolean
    | undefined,) {
    this._sxFilledAreasThickness =
      value === undefined
        ? undefined
        : value instanceof ZoneFilledAreasThickness
          ? value
          : new ZoneFilledAreasThickness(value)
  }

  get keepout(): ZoneKeepout | undefined {
    return this._sxKeepout
  }

  set keepout(value: ZoneKeepout | undefined) {
    this._sxKeepout = value
  }

  get placement(): ZonePlacement | undefined {
    return this._sxPlacement
  }

  set placement(value: ZonePlacement | undefined) {
    this._sxPlacement = value
  }

  get fill(): ZoneFill | undefined {
    return this._sxFill
  }

  set fill(value: ZoneFill | undefined) {
    this._sxFill = value
  }

  get polygons(): ZonePolygon[] {
    return [...this._polygons]
  }

  set polygons(value: ZonePolygon[]) {
    this._polygons = [...value]
  }

  get filledPolygons(): ZoneFilledPolygon[] {
    return [...this._filledPolygons]
  }

  set filledPolygons(value: ZoneFilledPolygon[]) {
    this._filledPolygons = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxNet) children.push(this._sxNet)
    if (this._sxNetName) children.push(this._sxNetName)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxLayers) children.push(this._sxLayers)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxName) children.push(this._sxName)
    if (this._sxHatch) children.push(this._sxHatch)
    if (this._sxPriority) children.push(this._sxPriority)
    if (this._sxAttr) children.push(this._sxAttr)
    if (this._sxConnectPads) children.push(this._sxConnectPads)
    if (this._sxMinThickness) children.push(this._sxMinThickness)
    if (this._sxFilledAreasThickness)
      children.push(this._sxFilledAreasThickness)
    if (this._sxKeepout) children.push(this._sxKeepout)
    if (this._sxPlacement) children.push(this._sxPlacement)
    if (this._sxFill) children.push(this._sxFill)
    children.push(...this._polygons)
    children.push(...this._filledPolygons)
    return children
  }
}
SxClass.register(Zone)
