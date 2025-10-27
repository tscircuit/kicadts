import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At, type AtInput } from "./At"
import { PadChamfer } from "./PadChamfer"
import { PadChamferRatio } from "./PadChamferRatio"
import { PadClearance } from "./PadClearance"
import { PadDieLength } from "./PadDieLength"
import { PadDrill } from "./PadDrill"
import { PadLayers, type PadLayersInput } from "./PadLayers"
import { PadNet } from "./PadNet"
import { PadOptions } from "./PadOptions"
import { PadPinFunction } from "./PadPinFunction"
import { PadPinType } from "./PadPinType"
import { PadPrimitives } from "./PadPrimitives"
import { PadRoundrectRratio } from "./PadRoundrectRratio"
import { PadSize, type PadSizeInput } from "./PadSize"
import { PadSolderMaskMargin } from "./PadSolderMaskMargin"
import { PadSolderPasteMargin } from "./PadSolderPasteMargin"
import { PadSolderPasteMarginRatio } from "./PadSolderPasteMarginRatio"
import { PadThermalGap } from "./PadThermalGap"
import { PadThermalWidth } from "./PadThermalWidth"
import { PadThermalBridgeAngle } from "./PadThermalBridgeAngle"
import { PadZoneConnect } from "./PadZoneConnect"
import { Property } from "./Property"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Tstamp } from "./Tstamp"
import { Width } from "./Width"
import { PadTeardrops } from "./PadTeardrops"
import { PadRectDelta } from "./PadRectDelta"

const SINGLE_TOKENS = new Set([
  "at",
  "size",
  "drill",
  "layers",
  "width",
  "stroke",
  "rect_delta",
  "roundrect_rratio",
  "chamfer_ratio",
  "chamfer",
  "net",
  "tstamp",
  "uuid",
  "pinfunction",
  "pintype",
  "die_length",
  "solder_mask_margin",
  "solder_paste_margin",
  "solder_paste_margin_ratio",
  "clearance",
  "zone_connect",
  "thermal_width",
  "thermal_gap",
  "thermal_bridge_angle",
  "options",
  "primitives",
  "remove_unused_layers",
  "keep_end_layers",
  "teardrops",
])

const MULTI_TOKENS = new Set(["property"])

const SUPPORTED_TOKENS = new Set([...SINGLE_TOKENS, ...MULTI_TOKENS])

const ensureSingle = (
  arrayPropertyMap: Record<string, SxClass[]>,
  token: string,
) => {
  const entries = arrayPropertyMap[token]
  if (entries && entries.length > 1) {
    throw new Error(`pad does not support repeated "${token}" children`)
  }
}

export interface FootprintPadConstructorParams {
  number?: string
  padType?: string
  shape?: string
  locked?: boolean
  removeUnusedLayers?: boolean
  keepEndLayers?: boolean
  at?: AtInput
  size?: PadSizeInput
  drill?: PadDrill
  layers?: PadLayersInput
  width?: Width | number
  stroke?: Stroke
  properties?: Property[]
  roundrectRatio?: number | PadRoundrectRratio
  chamferRatio?: number | PadChamferRatio
  chamfer?: PadChamfer
  rectDelta?: PadRectDelta
  net?: PadNet
  tstamp?: Tstamp | string
  uuid?: Uuid | string
  pinFunction?: string | PadPinFunction
  pinType?: string | PadPinType
  dieLength?: number | PadDieLength
  solderMaskMargin?: number | PadSolderMaskMargin
  solderPasteMargin?: number | PadSolderPasteMargin
  solderPasteMarginRatio?: number | PadSolderPasteMarginRatio
  clearance?: number | PadClearance
  zoneConnect?: number | PadZoneConnect
  thermalWidth?: number | PadThermalWidth
  thermalGap?: number | PadThermalGap
  thermalBridgeAngle?: number | PadThermalBridgeAngle
  options?: PadOptions
  primitives?: PadPrimitives
  teardrops?: PadTeardrops
}

export class FootprintPad extends SxClass {
  static override token = "pad"
  token = "pad"

  private _number = ""
  private _padType = ""
  private _shape = ""
  private _locked = false
  private _sxRemoveUnusedLayers?: PadRemoveUnusedLayers
  private _sxKeepEndLayers?: PadKeepEndLayers

  private _sxAt?: At
  private _sxSize?: PadSize
  private _sxDrill?: PadDrill
  private _sxLayers?: PadLayers
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _properties: Property[] = []
  private _sxRoundrectRatio?: PadRoundrectRratio
  private _sxChamferRatio?: PadChamferRatio
  private _sxChamfer?: PadChamfer
  private _sxRectDelta?: PadRectDelta
  private _sxNet?: PadNet
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid
  private _sxPinFunction?: PadPinFunction
  private _sxPinType?: PadPinType
  private _sxDieLength?: PadDieLength
  private _sxSolderMaskMargin?: PadSolderMaskMargin
  private _sxSolderPasteMargin?: PadSolderPasteMargin
  private _sxSolderPasteMarginRatio?: PadSolderPasteMarginRatio
  private _sxClearance?: PadClearance
  private _sxZoneConnect?: PadZoneConnect
  private _sxThermalWidth?: PadThermalWidth
  private _sxThermalGap?: PadThermalGap
  private _sxThermalBridgeAngle?: PadThermalBridgeAngle
  private _sxOptions?: PadOptions
  private _sxPrimitives?: PadPrimitives
  private _sxTeardrops?: PadTeardrops

  constructor(
    params?: FootprintPadConstructorParams | string,
    padType?: string,
    shape?: string,
  ) {
    super()

    // Support legacy string-based constructor
    if (typeof params === "string") {
      this._number = params
      this._padType = padType || ""
      this._shape = shape || ""
      return
    }

    // Modern params-based constructor
    const p = params || {}
    if (p.number !== undefined) this.number = p.number
    if (p.padType !== undefined) this.padType = p.padType
    if (p.shape !== undefined) this.shape = p.shape
    if (p.locked !== undefined) this.locked = p.locked
    if (p.removeUnusedLayers !== undefined)
      this.removeUnusedLayer = p.removeUnusedLayers
    if (p.keepEndLayers !== undefined) this.keepEndLayers = p.keepEndLayers
    if (p.at !== undefined) this.at = p.at
    if (p.size !== undefined) this.size = p.size
    if (p.drill !== undefined) this.drill = p.drill
    if (p.layers !== undefined) this.layers = p.layers
    if (p.width !== undefined) this.width = p.width
    if (p.stroke !== undefined) this.stroke = p.stroke
    if (p.properties !== undefined) this.properties = p.properties
    if (p.roundrectRatio !== undefined) this.roundrectRatio = p.roundrectRatio
    if (p.chamferRatio !== undefined) this.chamferRatio = p.chamferRatio
    if (p.chamfer !== undefined) this.chamfer = p.chamfer
    if (p.rectDelta !== undefined) this.rectDelta = p.rectDelta
    if (p.net !== undefined) this.net = p.net
    if (p.tstamp !== undefined) this.tstamp = p.tstamp
    if (p.uuid !== undefined) this.uuid = p.uuid
    if (p.pinFunction !== undefined) this.pinfunction = p.pinFunction
    if (p.pinType !== undefined) this.pintype = p.pinType
    if (p.dieLength !== undefined) this.dieLength = p.dieLength
    if (p.solderMaskMargin !== undefined)
      this.solderMaskMargin = p.solderMaskMargin
    if (p.solderPasteMargin !== undefined)
      this.solderPasteMargin = p.solderPasteMargin
    if (p.solderPasteMarginRatio !== undefined)
      this.solderPasteMarginRatio = p.solderPasteMarginRatio
    if (p.clearance !== undefined) this.clearance = p.clearance
    if (p.zoneConnect !== undefined) this.zoneConnect = p.zoneConnect
    if (p.thermalWidth !== undefined) this.thermalWidth = p.thermalWidth
    if (p.thermalGap !== undefined) this.thermalGap = p.thermalGap
    if (p.thermalBridgeAngle !== undefined)
      this.thermalBridgeAngle = p.thermalBridgeAngle
    if (p.options !== undefined) this.options = p.options
    if (p.primitives !== undefined) this.primitives = p.primitives
    if (p.teardrops !== undefined) this.teardrops = p.teardrops
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintPad {
    if (primitiveSexprs.length < 3) {
      throw new Error("pad requires number, type, and shape arguments")
    }

    const [rawNumber, rawType, rawShape, ...rest] = primitiveSexprs
    const number = toStringValue(rawNumber)
    const padType = toStringValue(rawType)
    const shape = toStringValue(rawShape)
    if (number === undefined || padType === undefined || shape === undefined) {
      throw new Error("pad header tokens must be strings")
    }

    const pad = new FootprintPad(number, padType, shape)

    const primitiveStrings: string[] = []
    const primitiveNodes: PrimitiveSExpr[] = []

    for (const primitive of rest) {
      if (typeof primitive === "string") {
        primitiveStrings.push(primitive)
      } else if (Array.isArray(primitive)) {
        primitiveNodes.push(primitive)
      } else {
        throw new Error(
          `pad encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
        )
      }
    }

    for (const flag of primitiveStrings) {
      switch (flag) {
        case "locked":
          pad._locked = true
          break
        case "remove_unused_layer":
          pad._sxRemoveUnusedLayers = new PadRemoveUnusedLayers({
            value: true,
            bareToken: "remove_unused_layer",
          })
          break
        case "keep_end_layers":
          pad._sxKeepEndLayers = new PadKeepEndLayers({
            value: true,
            bare: true,
          })
          break
        default:
          throw new Error(`pad encountered unsupported flag "${flag}"`)
      }
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveNodes, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`pad encountered unsupported child token "${token}"`)
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`pad encountered unsupported child token "${token}"`)
      }
      if (!MULTI_TOKENS.has(token) && entries.length > 1) {
        throw new Error(`pad does not support repeated child "${token}"`)
      }
    }

    ensureSingle(arrayPropertyMap, "at")
    ensureSingle(arrayPropertyMap, "size")
    ensureSingle(arrayPropertyMap, "drill")
    ensureSingle(arrayPropertyMap, "layers")
    ensureSingle(arrayPropertyMap, "width")
    ensureSingle(arrayPropertyMap, "stroke")
    ensureSingle(arrayPropertyMap, "rect_delta")
    ensureSingle(arrayPropertyMap, "roundrect_rratio")
    ensureSingle(arrayPropertyMap, "chamfer_ratio")
    ensureSingle(arrayPropertyMap, "chamfer")
    ensureSingle(arrayPropertyMap, "net")
    ensureSingle(arrayPropertyMap, "uuid")
    ensureSingle(arrayPropertyMap, "pinfunction")
    ensureSingle(arrayPropertyMap, "pintype")
    ensureSingle(arrayPropertyMap, "die_length")
    ensureSingle(arrayPropertyMap, "solder_mask_margin")
    ensureSingle(arrayPropertyMap, "solder_paste_margin")
    ensureSingle(arrayPropertyMap, "solder_paste_margin_ratio")
    ensureSingle(arrayPropertyMap, "clearance")
    ensureSingle(arrayPropertyMap, "zone_connect")
    ensureSingle(arrayPropertyMap, "thermal_width")
    ensureSingle(arrayPropertyMap, "thermal_gap")
    ensureSingle(arrayPropertyMap, "thermal_bridge_angle")
    ensureSingle(arrayPropertyMap, "options")
    ensureSingle(arrayPropertyMap, "primitives")

    pad._sxAt = propertyMap.at as At | undefined
    pad._sxSize = propertyMap.size as PadSize | undefined
    pad._sxDrill = propertyMap.drill as PadDrill | undefined
    pad._sxLayers = propertyMap.layers as PadLayers | undefined
    pad._sxWidth = propertyMap.width as Width | undefined
    pad._sxStroke = propertyMap.stroke as Stroke | undefined
    pad._sxRectDelta = propertyMap.rect_delta as PadRectDelta | undefined

    pad._properties = (arrayPropertyMap.property as Property[]) ?? []

    pad._sxRoundrectRatio = propertyMap.roundrect_rratio as
      | PadRoundrectRratio
      | undefined
    pad._sxChamferRatio = propertyMap.chamfer_ratio as
      | PadChamferRatio
      | undefined
    pad._sxChamfer = propertyMap.chamfer as PadChamfer | undefined
    pad._sxNet = propertyMap.net as PadNet | undefined
    pad._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    pad._sxUuid = propertyMap.uuid as Uuid | undefined
    pad._sxPinFunction = propertyMap.pinfunction as PadPinFunction | undefined
    pad._sxPinType = propertyMap.pintype as PadPinType | undefined
    pad._sxDieLength = propertyMap.die_length as PadDieLength | undefined
    pad._sxSolderMaskMargin = propertyMap.solder_mask_margin as
      | PadSolderMaskMargin
      | undefined
    pad._sxSolderPasteMargin = propertyMap.solder_paste_margin as
      | PadSolderPasteMargin
      | undefined
    pad._sxSolderPasteMarginRatio = propertyMap.solder_paste_margin_ratio as
      | PadSolderPasteMarginRatio
      | undefined
    pad._sxClearance = propertyMap.clearance as PadClearance | undefined
    pad._sxZoneConnect = propertyMap.zone_connect as PadZoneConnect | undefined
    pad._sxThermalWidth = propertyMap.thermal_width as
      | PadThermalWidth
      | undefined
    pad._sxThermalGap = propertyMap.thermal_gap as PadThermalGap | undefined
    pad._sxThermalBridgeAngle = propertyMap.thermal_bridge_angle as
      | PadThermalBridgeAngle
      | undefined
    pad._sxOptions = propertyMap.options as PadOptions | undefined
    pad._sxPrimitives = propertyMap.primitives as PadPrimitives | undefined
    pad._sxRemoveUnusedLayers =
      (arrayPropertyMap.remove_unused_layers?.[0] as
        | PadRemoveUnusedLayers
        | undefined) ?? pad._sxRemoveUnusedLayers
    pad._sxKeepEndLayers =
      (arrayPropertyMap.keep_end_layers?.[0] as PadKeepEndLayers | undefined) ??
      pad._sxKeepEndLayers
    pad._sxTeardrops =
      (arrayPropertyMap.teardrops?.[0] as PadTeardrops | undefined) ?? undefined

    return pad
  }

  get number(): string {
    return this._number
  }

  set number(value: string) {
    this._number = value
  }

  get padType(): string {
    return this._padType
  }

  set padType(value: string) {
    this._padType = value
  }

  get shape(): string {
    return this._shape
  }

  set shape(value: string) {
    this._shape = value
  }

  get locked(): boolean {
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
  }

  get removeUnusedLayer(): boolean {
    return this._sxRemoveUnusedLayers?.value ?? false
  }

  set removeUnusedLayer(value: boolean) {
    this._sxRemoveUnusedLayers = value
      ? new PadRemoveUnusedLayers({ value })
      : undefined
  }

  get keepEndLayers(): boolean {
    return this._sxKeepEndLayers?.value ?? false
  }

  set keepEndLayers(value: boolean) {
    this._sxKeepEndLayers = value ? new PadKeepEndLayers({ value }) : undefined
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: AtInput | undefined) {
    this._sxAt = value !== undefined ? At.from(value) : undefined
  }

  get size(): PadSize | undefined {
    return this._sxSize
  }

  set size(value: PadSizeInput | undefined) {
    this._sxSize = value !== undefined ? PadSize.from(value) : undefined
  }

  get drill(): PadDrill | undefined {
    return this._sxDrill
  }

  set drill(value: PadDrill | undefined) {
    this._sxDrill = value
  }

  get layers(): PadLayers | undefined {
    return this._sxLayers
  }

  set layers(value: PadLayersInput | undefined) {
    this._sxLayers = value !== undefined ? PadLayers.from(value) : undefined
  }

  get width(): Width | undefined {
    return this._sxWidth
  }

  set width(value: number | Width | undefined) {
    if (value === undefined) {
      this._sxWidth = undefined
      return
    }
    this._sxWidth = typeof value === "number" ? new Width(value) : value
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get properties(): Property[] {
    return [...this._properties]
  }

  set properties(value: Property[]) {
    this._properties = [...value]
  }

  get roundrectRatio(): number | undefined {
    return this._sxRoundrectRatio?.value
  }

  set roundrectRatio(value: number | PadRoundrectRratio | undefined) {
    if (value === undefined) {
      this._sxRoundrectRatio = undefined
      return
    }
    this._sxRoundrectRatio =
      typeof value === "number" ? new PadRoundrectRratio(value) : value
  }

  get chamferRatio(): number | undefined {
    return this._sxChamferRatio?.value
  }

  set chamferRatio(value: number | PadChamferRatio | undefined) {
    if (value === undefined) {
      this._sxChamferRatio = undefined
      return
    }
    this._sxChamferRatio =
      typeof value === "number" ? new PadChamferRatio(value) : value
  }

  get chamfer(): PadChamfer | undefined {
    return this._sxChamfer
  }

  set chamfer(value: PadChamfer | undefined) {
    this._sxChamfer = value
  }

  get chamferCorners(): string[] | undefined {
    return this._sxChamfer?.corners
  }

  get rectDelta(): PadRectDelta | undefined {
    return this._sxRectDelta
  }

  set rectDelta(value: PadRectDelta | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxRectDelta = undefined
      return
    }
    if (value instanceof PadRectDelta) {
      this._sxRectDelta = value
      return
    }
    this._sxRectDelta = new PadRectDelta(value.x, value.y)
  }

  get net(): PadNet | undefined {
    return this._sxNet
  }

  set net(value: PadNet | undefined) {
    this._sxNet = value
  }

  get tstamp(): Tstamp | undefined {
    return this._sxTstamp
  }

  set tstamp(value: Tstamp | string | undefined) {
    if (value === undefined) {
      this._sxTstamp = undefined
      return
    }
    this._sxTstamp = value instanceof Tstamp ? value : new Tstamp(value)
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

  get pinfunction(): string | undefined {
    return this._sxPinFunction?.value
  }

  set pinfunction(value: string | PadPinFunction | undefined) {
    if (value === undefined) {
      this._sxPinFunction = undefined
      return
    }
    this._sxPinFunction =
      typeof value === "string" ? new PadPinFunction(value) : value
  }

  get pintype(): string | undefined {
    return this._sxPinType?.value
  }

  set pintype(value: string | PadPinType | undefined) {
    if (value === undefined) {
      this._sxPinType = undefined
      return
    }
    this._sxPinType = typeof value === "string" ? new PadPinType(value) : value
  }

  get dieLength(): number | undefined {
    return this._sxDieLength?.value
  }

  set dieLength(value: number | PadDieLength | undefined) {
    if (value === undefined) {
      this._sxDieLength = undefined
      return
    }
    this._sxDieLength =
      typeof value === "number" ? new PadDieLength(value) : value
  }

  get solderMaskMargin(): number | undefined {
    return this._sxSolderMaskMargin?.value
  }

  set solderMaskMargin(value: number | PadSolderMaskMargin | undefined) {
    if (value === undefined) {
      this._sxSolderMaskMargin = undefined
      return
    }
    this._sxSolderMaskMargin =
      typeof value === "number" ? new PadSolderMaskMargin(value) : value
  }

  get solderPasteMargin(): number | undefined {
    return this._sxSolderPasteMargin?.value
  }

  set solderPasteMargin(value: number | PadSolderPasteMargin | undefined) {
    if (value === undefined) {
      this._sxSolderPasteMargin = undefined
      return
    }
    this._sxSolderPasteMargin =
      typeof value === "number" ? new PadSolderPasteMargin(value) : value
  }

  get solderPasteMarginRatio(): number | undefined {
    return this._sxSolderPasteMarginRatio?.value
  }

  set solderPasteMarginRatio(value:
    | number
    | PadSolderPasteMarginRatio
    | undefined) {
    if (value === undefined) {
      this._sxSolderPasteMarginRatio = undefined
      return
    }
    this._sxSolderPasteMarginRatio =
      typeof value === "number" ? new PadSolderPasteMarginRatio(value) : value
  }

  get clearance(): number | undefined {
    return this._sxClearance?.value
  }

  set clearance(value: number | PadClearance | undefined) {
    if (value === undefined) {
      this._sxClearance = undefined
      return
    }
    this._sxClearance =
      typeof value === "number" ? new PadClearance(value) : value
  }

  get zoneConnect(): number | undefined {
    return this._sxZoneConnect?.value
  }

  set zoneConnect(value: number | PadZoneConnect | undefined) {
    if (value === undefined) {
      this._sxZoneConnect = undefined
      return
    }
    this._sxZoneConnect =
      typeof value === "number" ? new PadZoneConnect(value) : value
  }

  get thermalWidth(): number | undefined {
    return this._sxThermalWidth?.value
  }

  set thermalWidth(value: number | PadThermalWidth | undefined) {
    if (value === undefined) {
      this._sxThermalWidth = undefined
      return
    }
    this._sxThermalWidth =
      typeof value === "number" ? new PadThermalWidth(value) : value
  }

  get thermalGap(): number | undefined {
    return this._sxThermalGap?.value
  }

  set thermalGap(value: number | PadThermalGap | undefined) {
    if (value === undefined) {
      this._sxThermalGap = undefined
      return
    }
    this._sxThermalGap =
      typeof value === "number" ? new PadThermalGap(value) : value
  }

  get thermalBridgeAngle(): number | undefined {
    return this._sxThermalBridgeAngle?.value
  }

  set thermalBridgeAngle(value: number | PadThermalBridgeAngle | undefined) {
    if (value === undefined) {
      this._sxThermalBridgeAngle = undefined
      return
    }
    this._sxThermalBridgeAngle =
      typeof value === "number" ? new PadThermalBridgeAngle(value) : value
  }

  get options(): PadOptions | undefined {
    return this._sxOptions
  }

  set options(value: PadOptions | undefined) {
    this._sxOptions = value
  }

  get primitives(): PadPrimitives | undefined {
    return this._sxPrimitives
  }

  set primitives(value: PadPrimitives | undefined) {
    this._sxPrimitives = value
  }

  get teardrops(): PadTeardrops | undefined {
    return this._sxTeardrops
  }

  set teardrops(value: PadTeardrops | undefined) {
    this._sxTeardrops = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxSize) children.push(this._sxSize)
    if (this._sxDrill) children.push(this._sxDrill)
    if (this._sxLayers) children.push(this._sxLayers)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxStroke) children.push(this._sxStroke)
    children.push(...this._properties)
    if (this._sxRoundrectRatio) children.push(this._sxRoundrectRatio)
    if (this._sxChamferRatio) children.push(this._sxChamferRatio)
    if (this._sxChamfer) children.push(this._sxChamfer)
    if (this._sxRectDelta) children.push(this._sxRectDelta)
    if (this._sxNet) children.push(this._sxNet)
    if (this._sxPinFunction) children.push(this._sxPinFunction)
    if (this._sxPinType) children.push(this._sxPinType)
    if (this._sxDieLength) children.push(this._sxDieLength)
    if (this._sxSolderMaskMargin) children.push(this._sxSolderMaskMargin)
    if (this._sxSolderPasteMargin) children.push(this._sxSolderPasteMargin)
    if (this._sxSolderPasteMarginRatio)
      children.push(this._sxSolderPasteMarginRatio)
    if (this._sxClearance) children.push(this._sxClearance)
    if (this._sxZoneConnect) children.push(this._sxZoneConnect)
    if (this._sxThermalWidth) children.push(this._sxThermalWidth)
    if (this._sxThermalGap) children.push(this._sxThermalGap)
    if (this._sxThermalBridgeAngle) children.push(this._sxThermalBridgeAngle)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxRemoveUnusedLayers) children.push(this._sxRemoveUnusedLayers)
    if (this._sxKeepEndLayers) children.push(this._sxKeepEndLayers)
    if (this._sxTeardrops) children.push(this._sxTeardrops)
    if (this._sxOptions) children.push(this._sxOptions)
    if (this._sxPrimitives) children.push(this._sxPrimitives)
    return children
  }

  override getString(): string {
    const lines = [
      `(pad ${quoteSExprString(this._number)} ${this._padType} ${this._shape}`,
    ]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    if (this._locked) {
      lines.push("  locked")
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FootprintPad)

class PadRemoveUnusedLayers extends SxPrimitiveBoolean {
  static override token = "remove_unused_layers"
  static override parentToken = "pad"
  override token = "remove_unused_layers"

  private readonly bareToken?: string

  constructor(options: { value?: boolean; bareToken?: string } = {}) {
    super(options.value ?? false)
    this.bareToken = options.bareToken
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadRemoveUnusedLayers {
    const [raw] = primitiveSexprs
    if (raw === undefined) {
      return new PadRemoveUnusedLayers({ value: false })
    }
    if (typeof raw === "boolean") {
      return new PadRemoveUnusedLayers({ value: raw })
    }
    if (typeof raw === "string") {
      const normalized = raw.toLowerCase()
      if (normalized === "yes" || normalized === "true") {
        return new PadRemoveUnusedLayers({ value: true })
      }
      if (normalized === "no" || normalized === "false") {
        return new PadRemoveUnusedLayers({ value: false })
      }
    }
    throw new Error(
      `remove_unused_layers expects yes/no or boolean, received ${JSON.stringify(raw)}`,
    )
  }

  override getString(): string {
    if (this.bareToken) {
      return this.bareToken
    }
    return `(remove_unused_layers ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(PadRemoveUnusedLayers)

class PadKeepEndLayers extends SxPrimitiveBoolean {
  static override token = "keep_end_layers"
  static override parentToken = "pad"
  override token = "keep_end_layers"

  private readonly renderBare: boolean

  constructor(options: { value?: boolean; bare?: boolean } = {}) {
    super(options.value ?? false)
    this.renderBare = options.bare ?? false
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadKeepEndLayers {
    const [raw] = primitiveSexprs
    if (raw === undefined) {
      return new PadKeepEndLayers({ value: false })
    }
    if (typeof raw === "boolean") {
      return new PadKeepEndLayers({ value: raw })
    }
    if (typeof raw === "string") {
      const normalized = raw.toLowerCase()
      if (normalized === "yes" || normalized === "true") {
        return new PadKeepEndLayers({ value: true })
      }
      if (normalized === "no" || normalized === "false") {
        return new PadKeepEndLayers({ value: false })
      }
    }
    throw new Error(
      `keep_end_layers expects yes/no or boolean, received ${JSON.stringify(raw)}`,
    )
  }

  override getString(): string {
    if (this.renderBare) {
      return "keep_end_layers"
    }
    return `(keep_end_layers ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(PadKeepEndLayers)
