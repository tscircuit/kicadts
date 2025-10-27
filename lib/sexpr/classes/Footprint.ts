import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { At, type AtInput } from "./At"
import { FootprintAttr } from "./FootprintAttr"
import { FootprintAutoplaceCost180 } from "./FootprintAutoplaceCost180"
import { FootprintAutoplaceCost90 } from "./FootprintAutoplaceCost90"
import { FootprintClearance } from "./FootprintClearance"
import { FootprintDescr } from "./FootprintDescr"
import { FootprintNetTiePadGroups } from "./FootprintNetTiePadGroups"
import { FootprintPath } from "./FootprintPath"
import { FootprintPrivateLayers } from "./FootprintPrivateLayers"
import { FootprintSolderMaskMargin } from "./FootprintSolderMaskMargin"
import { FootprintSolderPasteMargin } from "./FootprintSolderPasteMargin"
import { FootprintSolderPasteRatio } from "./FootprintSolderPasteRatio"
import { FootprintTags } from "./FootprintTags"
import { FootprintTedit } from "./FootprintTedit"
import { FootprintThermalGap } from "./FootprintThermalGap"
import { FootprintThermalWidth } from "./FootprintThermalWidth"
import { FootprintZoneConnect } from "./FootprintZoneConnect"
import { FootprintPad } from "./FootprintPad"
import { Property } from "./Property"
import { Layer } from "./Layer"
import { FpText } from "./FpText"
import { FpTextBox } from "./FpTextBox"
import { FpRect } from "./FpRect"
import { FpCircle } from "./FpCircle"
import { FpArc } from "./FpArc"
import { FpPoly } from "./FpPoly"
import { Uuid } from "./Uuid"
import { Tstamp } from "./Tstamp"
import { Xy } from "./Xy"
import { FootprintSheetname } from "./FootprintSheetname"
import { FootprintSheetfile } from "./FootprintSheetfile"
import { FpLine } from "./FpLine"
import { FootprintModel } from "./FootprintModel"
import { EmbeddedFonts } from "./EmbeddedFonts"
import { FootprintLocked } from "./FootprintLocked"
import { FootprintPlaced } from "./FootprintPlaced"

const SINGLE_TOKENS = new Set([
  "layer",
  "locked",
  "placed",
  "tedit",
  "tstamp",
  "uuid",
  "at",
  "xy",
  "descr",
  "tags",
  "path",
  "autoplace_cost90",
  "autoplace_cost180",
  "solder_mask_margin",
  "solder_paste_margin",
  "solder_paste_ratio",
  "clearance",
  "zone_connect",
  "thermal_width",
  "thermal_gap",
  "attr",
  "private_layers",
  "net_tie_pad_groups",
  "sheetname",
  "sheetfile",
  "embedded_fonts",
])

const MULTI_TOKENS = new Set([
  "property",
  "fp_text",
  "fp_text_box",
  "fp_line",
  "fp_rect",
  "fp_circle",
  "fp_arc",
  "fp_poly",
  "pad",
  "model",
])

const SUPPORTED_TOKENS = new Set([...SINGLE_TOKENS, ...MULTI_TOKENS])

export interface FootprintConstructorParams {
  libraryLink?: string
  locked?: boolean
  placed?: boolean
  layer?: Layer | string | string[]
  tstamp?: Tstamp | string
  uuid?: Uuid | string
  at?: AtInput | Xy
  descr?: string | FootprintDescr
  tags?: string | string[] | FootprintTags
  path?: string | FootprintPath
  autoplaceCost90?: number | FootprintAutoplaceCost90
  autoplaceCost180?: number | FootprintAutoplaceCost180
  solderMaskMargin?: number | FootprintSolderMaskMargin
  solderPasteMargin?: number | FootprintSolderPasteMargin
  solderPasteRatio?: number | FootprintSolderPasteRatio
  clearance?: number | FootprintClearance
  zoneConnect?: number | FootprintZoneConnect
  thermalWidth?: number | FootprintThermalWidth
  thermalGap?: number | FootprintThermalGap
  attr?: FootprintAttr
  privateLayers?: FootprintPrivateLayers
  netTiePadGroups?: FootprintNetTiePadGroups
  sheetname?: string | FootprintSheetname
  sheetfile?: string | FootprintSheetfile
  embeddedFonts?: EmbeddedFonts
  properties?: Property[]
  fpTexts?: FpText[]
  fpTextBoxes?: FpTextBox[]
  fpLines?: FpLine[]
  fpRects?: FpRect[]
  fpCircles?: FpCircle[]
  fpArcs?: FpArc[]
  fpPolys?: FpPoly[]
  pads?: FootprintPad[]
  models?: FootprintModel[]
}

export class Footprint extends SxClass {
  static override token = "footprint"
  token = "footprint"

  private _libraryLink?: string
  private _sxLocked?: FootprintLocked
  private _sxPlaced?: FootprintPlaced

  private _sxLayer?: Layer
  private _sxTedit?: FootprintTedit
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid
  private _sxAt?: At
  private _sxXy?: Xy
  private _sxDescr?: FootprintDescr
  private _sxTags?: FootprintTags
  private _sxPath?: FootprintPath
  private _sxAutoplaceCost90?: FootprintAutoplaceCost90
  private _sxAutoplaceCost180?: FootprintAutoplaceCost180
  private _sxSolderMaskMargin?: FootprintSolderMaskMargin
  private _sxSolderPasteMargin?: FootprintSolderPasteMargin
  private _sxSolderPasteRatio?: FootprintSolderPasteRatio
  private _sxClearance?: FootprintClearance
  private _sxZoneConnect?: FootprintZoneConnect
  private _sxThermalWidth?: FootprintThermalWidth
  private _sxThermalGap?: FootprintThermalGap
  private _sxAttr?: FootprintAttr
  private _sxPrivateLayers?: FootprintPrivateLayers
  private _sxNetTiePadGroups?: FootprintNetTiePadGroups
  private _sxSheetname?: FootprintSheetname
  private _sxSheetfile?: FootprintSheetfile
  private _sxEmbeddedFonts?: EmbeddedFonts

  private _properties: Property[] = []
  private _fpTexts: FpText[] = []
  private _fpTextBoxes: FpTextBox[] = []
  private _fpLines: FpLine[] = []
  private _fpRects: FpRect[] = []
  private _fpCircles: FpCircle[] = []
  private _fpArcs: FpArc[] = []
  private _fpPolys: FpPoly[] = []
  private _fpPads: FootprintPad[] = []
  private _models: FootprintModel[] = []

  constructor(params: FootprintConstructorParams = {}) {
    super()
    if (params.libraryLink !== undefined) this.libraryLink = params.libraryLink
    if (params.locked !== undefined) this.locked = params.locked
    if (params.placed !== undefined) this.placed = params.placed
    if (params.layer !== undefined) this.layer = params.layer
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.at !== undefined) this.position = params.at
    if (params.descr !== undefined) this.descr = params.descr
    if (params.tags !== undefined) this.tags = params.tags
    if (params.path !== undefined) this.path = params.path
    if (params.autoplaceCost90 !== undefined)
      this.autoplaceCost90 = params.autoplaceCost90
    if (params.autoplaceCost180 !== undefined)
      this.autoplaceCost180 = params.autoplaceCost180
    if (params.solderMaskMargin !== undefined)
      this.solderMaskMargin = params.solderMaskMargin
    if (params.solderPasteMargin !== undefined)
      this.solderPasteMargin = params.solderPasteMargin
    if (params.solderPasteRatio !== undefined)
      this.solderPasteRatio = params.solderPasteRatio
    if (params.clearance !== undefined) this.clearance = params.clearance
    if (params.zoneConnect !== undefined) this.zoneConnect = params.zoneConnect
    if (params.thermalWidth !== undefined)
      this.thermalWidth = params.thermalWidth
    if (params.thermalGap !== undefined) this.thermalGap = params.thermalGap
    if (params.attr !== undefined) this.attr = params.attr
    if (params.privateLayers !== undefined)
      this.privateLayers = params.privateLayers
    if (params.netTiePadGroups !== undefined)
      this.netTiePadGroups = params.netTiePadGroups
    if (params.sheetname !== undefined) this.sheetname = params.sheetname
    if (params.sheetfile !== undefined) this.sheetfile = params.sheetfile
    if (params.embeddedFonts !== undefined)
      this.embeddedFonts = params.embeddedFonts
    if (params.properties !== undefined) this.properties = params.properties
    if (params.fpTexts !== undefined) this.fpTexts = params.fpTexts
    if (params.fpTextBoxes !== undefined) this.fpTextBoxes = params.fpTextBoxes
    if (params.fpLines !== undefined) this.fpLines = params.fpLines
    if (params.fpRects !== undefined) this.fpRects = params.fpRects
    if (params.fpCircles !== undefined) this.fpCircles = params.fpCircles
    if (params.fpArcs !== undefined) this.fpArcs = params.fpArcs
    if (params.fpPolys !== undefined) this.fpPolys = params.fpPolys
    if (params.pads !== undefined) this.fpPads = params.pads
    if (params.models !== undefined) this.models = params.models
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Footprint {
    const footprint = new Footprint()

    const rawStrings: string[] = []
    const rawNodes: PrimitiveSExpr[] = []

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        rawStrings.push(primitive)
        continue
      }
      if (Array.isArray(primitive)) {
        rawNodes.push(primitive)
        continue
      }
      throw new Error(
        `footprint encountered unsupported primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    let pendingFlags: string[] = []
    if (rawStrings.length > 0) {
      footprint._libraryLink = rawStrings[0]
      pendingFlags = rawStrings.slice(1)
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rawNodes, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `footprint encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `footprint encountered unsupported child token "${token}"`,
        )
      }
      if (!MULTI_TOKENS.has(token) && entries.length > 1) {
        throw new Error(
          `footprint does not support repeated child token "${token}"`,
        )
      }
    }

    footprint._sxLocked = propertyMap.locked as FootprintLocked | undefined
    if (footprint._sxLocked && !footprint._sxLocked.value) {
      footprint._sxLocked = undefined
    }
    footprint._sxPlaced = propertyMap.placed as FootprintPlaced | undefined
    if (footprint._sxPlaced && !footprint._sxPlaced.value) {
      footprint._sxPlaced = undefined
    }
    footprint._sxLayer = propertyMap.layer as Layer | undefined
    footprint._sxTedit = propertyMap.tedit as FootprintTedit | undefined
    footprint._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    footprint._sxUuid = propertyMap.uuid as Uuid | undefined
    footprint._sxAt = propertyMap.at as At | undefined
    footprint._sxXy = propertyMap.xy as Xy | undefined
    if (footprint._sxAt && footprint._sxXy) {
      throw new Error("footprint cannot include both at and xy children")
    }
    footprint._sxDescr = propertyMap.descr as FootprintDescr | undefined
    footprint._sxTags = propertyMap.tags as FootprintTags | undefined
    footprint._sxPath = propertyMap.path as FootprintPath | undefined
    footprint._sxAutoplaceCost90 = propertyMap.autoplace_cost90 as
      | FootprintAutoplaceCost90
      | undefined
    footprint._sxAutoplaceCost180 = propertyMap.autoplace_cost180 as
      | FootprintAutoplaceCost180
      | undefined
    footprint._sxSolderMaskMargin = propertyMap.solder_mask_margin as
      | FootprintSolderMaskMargin
      | undefined
    footprint._sxSolderPasteMargin = propertyMap.solder_paste_margin as
      | FootprintSolderPasteMargin
      | undefined
    footprint._sxSolderPasteRatio = propertyMap.solder_paste_ratio as
      | FootprintSolderPasteRatio
      | undefined
    footprint._sxClearance = propertyMap.clearance as
      | FootprintClearance
      | undefined
    footprint._sxZoneConnect = propertyMap.zone_connect as
      | FootprintZoneConnect
      | undefined
    footprint._sxThermalWidth = propertyMap.thermal_width as
      | FootprintThermalWidth
      | undefined
    footprint._sxThermalGap = propertyMap.thermal_gap as
      | FootprintThermalGap
      | undefined
    footprint._sxAttr = propertyMap.attr as FootprintAttr | undefined
    footprint._sxPrivateLayers = propertyMap.private_layers as
      | FootprintPrivateLayers
      | undefined
    footprint._sxNetTiePadGroups = propertyMap.net_tie_pad_groups as
      | FootprintNetTiePadGroups
      | undefined
    footprint._sxSheetname = propertyMap.sheetname as
      | FootprintSheetname
      | undefined
    footprint._sxSheetfile = propertyMap.sheetfile as
      | FootprintSheetfile
      | undefined
    footprint._sxEmbeddedFonts = propertyMap.embedded_fonts as
      | EmbeddedFonts
      | undefined

    footprint._properties = (arrayPropertyMap.property as Property[]) ?? []
    footprint._fpTexts = (arrayPropertyMap["fp_text"] as FpText[]) ?? []
    footprint._fpTextBoxes =
      (arrayPropertyMap["fp_text_box"] as FpTextBox[]) ?? []
    footprint._fpLines = (arrayPropertyMap["fp_line"] as FpLine[]) ?? []
    footprint._fpRects = (arrayPropertyMap["fp_rect"] as FpRect[]) ?? []
    footprint._fpCircles = (arrayPropertyMap["fp_circle"] as FpCircle[]) ?? []
    footprint._fpArcs = (arrayPropertyMap["fp_arc"] as FpArc[]) ?? []
    footprint._fpPolys = (arrayPropertyMap["fp_poly"] as FpPoly[]) ?? []
    footprint._fpPads = (arrayPropertyMap.pad as FootprintPad[]) ?? []
    footprint._models = (arrayPropertyMap.model as FootprintModel[]) ?? []

    for (const flag of pendingFlags) {
      if (flag === "locked") {
        if (footprint._sxLocked) {
          throw new Error("footprint encountered duplicate locked tokens")
        }
        footprint._sxLocked = new FootprintLocked(true)
        continue
      }
      if (flag === "placed") {
        if (footprint._sxPlaced) {
          throw new Error("footprint encountered duplicate placed tokens")
        }
        footprint._sxPlaced = new FootprintPlaced(true)
        continue
      }
      throw new Error(`footprint encountered unsupported flag "${flag}"`)
    }

    return footprint
  }

  get libraryLink(): string | undefined {
    return this._libraryLink
  }

  set libraryLink(value: string | undefined) {
    this._libraryLink = value
  }

  get locked(): boolean {
    return this._sxLocked?.value ?? false
  }

  set locked(value: FootprintLocked | boolean | undefined) {
    if (value === undefined) {
      this._sxLocked = undefined
      return
    }
    if (value instanceof FootprintLocked) {
      this._sxLocked = value.value ? value : undefined
      return
    }
    this._sxLocked = value ? new FootprintLocked(true) : undefined
  }

  get placed(): boolean {
    return this._sxPlaced?.value ?? false
  }

  set placed(value: FootprintPlaced | boolean | undefined) {
    if (value === undefined) {
      this._sxPlaced = undefined
      return
    }
    if (value instanceof FootprintPlaced) {
      this._sxPlaced = value.value ? value : undefined
      return
    }
    this._sxPlaced = value ? new FootprintPlaced(true) : undefined
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | string | string[] | undefined) {
    if (value === undefined) {
      this._sxLayer = undefined
      return
    }
    if (value instanceof Layer) {
      this._sxLayer = value
    } else {
      const names = Array.isArray(value) ? value : [value]
      this._sxLayer = new Layer(names)
    }
  }

  get tedit(): FootprintTedit | undefined {
    return this._sxTedit
  }

  set tedit(value: FootprintTedit | string | undefined) {
    if (value === undefined) {
      this._sxTedit = undefined
      return
    }
    this._sxTedit =
      value instanceof FootprintTedit ? value : new FootprintTedit(value)
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

  get position(): At | Xy | undefined {
    return this._sxAt ?? this._sxXy
  }

  set position(value: AtInput | Xy | undefined) {
    if (value === undefined) {
      this._sxAt = undefined
      this._sxXy = undefined
      return
    }
    if (value instanceof Xy) {
      this._sxXy = value
      this._sxAt = undefined
      return
    }
    // Handle AtInput (At, array, or object)
    this._sxAt = At.from(value as AtInput)
    this._sxXy = undefined
  }

  get descr(): FootprintDescr | undefined {
    return this._sxDescr
  }

  set descr(value: FootprintDescr | string | undefined) {
    if (value === undefined) {
      this._sxDescr = undefined
      return
    }
    this._sxDescr =
      value instanceof FootprintDescr ? value : new FootprintDescr(value)
  }

  get tags(): FootprintTags | undefined {
    return this._sxTags
  }

  set tags(value: string | string[] | FootprintTags | undefined) {
    if (value === undefined) {
      this._sxTags = undefined
      return
    }
    if (value instanceof FootprintTags) {
      this._sxTags = value
      return
    }
    const tagString = Array.isArray(value) ? value.join(" ") : value
    this._sxTags = new FootprintTags(tagString)
  }

  get path(): FootprintPath | undefined {
    return this._sxPath
  }

  set path(value: FootprintPath | string | undefined) {
    if (value === undefined) {
      this._sxPath = undefined
      return
    }
    this._sxPath =
      value instanceof FootprintPath ? value : new FootprintPath(value)
  }

  get autoplaceCost90(): FootprintAutoplaceCost90 | undefined {
    return this._sxAutoplaceCost90
  }

  set autoplaceCost90(value: FootprintAutoplaceCost90 | number | undefined) {
    if (value === undefined) {
      this._sxAutoplaceCost90 = undefined
      return
    }
    this._sxAutoplaceCost90 =
      value instanceof FootprintAutoplaceCost90
        ? value
        : new FootprintAutoplaceCost90(value)
  }

  get autoplaceCost180(): FootprintAutoplaceCost180 | undefined {
    return this._sxAutoplaceCost180
  }

  set autoplaceCost180(value: FootprintAutoplaceCost180 | number | undefined) {
    if (value === undefined) {
      this._sxAutoplaceCost180 = undefined
      return
    }
    this._sxAutoplaceCost180 =
      value instanceof FootprintAutoplaceCost180
        ? value
        : new FootprintAutoplaceCost180(value)
  }

  get solderMaskMargin(): FootprintSolderMaskMargin | undefined {
    return this._sxSolderMaskMargin
  }

  set solderMaskMargin(value: FootprintSolderMaskMargin | number | undefined) {
    if (value === undefined) {
      this._sxSolderMaskMargin = undefined
      return
    }
    this._sxSolderMaskMargin =
      value instanceof FootprintSolderMaskMargin
        ? value
        : new FootprintSolderMaskMargin(value)
  }

  get solderPasteMargin(): FootprintSolderPasteMargin | undefined {
    return this._sxSolderPasteMargin
  }

  set solderPasteMargin(value:
    | FootprintSolderPasteMargin
    | number
    | undefined) {
    if (value === undefined) {
      this._sxSolderPasteMargin = undefined
      return
    }
    this._sxSolderPasteMargin =
      value instanceof FootprintSolderPasteMargin
        ? value
        : new FootprintSolderPasteMargin(value)
  }

  get solderPasteRatio(): FootprintSolderPasteRatio | undefined {
    return this._sxSolderPasteRatio
  }

  set solderPasteRatio(value: FootprintSolderPasteRatio | number | undefined) {
    if (value === undefined) {
      this._sxSolderPasteRatio = undefined
      return
    }
    this._sxSolderPasteRatio =
      value instanceof FootprintSolderPasteRatio
        ? value
        : new FootprintSolderPasteRatio(value)
  }

  get clearance(): FootprintClearance | undefined {
    return this._sxClearance
  }

  set clearance(value: FootprintClearance | number | undefined) {
    if (value === undefined) {
      this._sxClearance = undefined
      return
    }
    this._sxClearance =
      value instanceof FootprintClearance
        ? value
        : new FootprintClearance(value)
  }

  get zoneConnect(): FootprintZoneConnect | undefined {
    return this._sxZoneConnect
  }

  set zoneConnect(value: FootprintZoneConnect | number | undefined) {
    if (value === undefined) {
      this._sxZoneConnect = undefined
      return
    }
    this._sxZoneConnect =
      value instanceof FootprintZoneConnect
        ? value
        : new FootprintZoneConnect(value)
  }

  get thermalWidth(): FootprintThermalWidth | undefined {
    return this._sxThermalWidth
  }

  set thermalWidth(value: FootprintThermalWidth | number | undefined) {
    if (value === undefined) {
      this._sxThermalWidth = undefined
      return
    }
    this._sxThermalWidth =
      value instanceof FootprintThermalWidth
        ? value
        : new FootprintThermalWidth(value)
  }

  get thermalGap(): FootprintThermalGap | undefined {
    return this._sxThermalGap
  }

  set thermalGap(value: FootprintThermalGap | number | undefined) {
    if (value === undefined) {
      this._sxThermalGap = undefined
      return
    }
    this._sxThermalGap =
      value instanceof FootprintThermalGap
        ? value
        : new FootprintThermalGap(value)
  }

  get attr(): FootprintAttr | undefined {
    return this._sxAttr
  }

  set attr(value: FootprintAttr | undefined) {
    this._sxAttr = value
  }

  get privateLayers(): FootprintPrivateLayers | undefined {
    return this._sxPrivateLayers
  }

  set privateLayers(value: FootprintPrivateLayers | string[] | undefined) {
    if (value === undefined) {
      this._sxPrivateLayers = undefined
      return
    }
    this._sxPrivateLayers =
      value instanceof FootprintPrivateLayers
        ? value
        : new FootprintPrivateLayers(value)
  }

  get netTiePadGroups(): FootprintNetTiePadGroups | undefined {
    return this._sxNetTiePadGroups
  }

  set netTiePadGroups(value: FootprintNetTiePadGroups | string[] | undefined) {
    if (value === undefined) {
      this._sxNetTiePadGroups = undefined
      return
    }
    this._sxNetTiePadGroups =
      value instanceof FootprintNetTiePadGroups
        ? value
        : new FootprintNetTiePadGroups(value)
  }

  get sheetname(): string | undefined {
    return this._sxSheetname?.value
  }

  set sheetname(value: string | FootprintSheetname | undefined) {
    if (value === undefined) {
      this._sxSheetname = undefined
      return
    }
    this._sxSheetname =
      value instanceof FootprintSheetname
        ? value
        : new FootprintSheetname(value)
  }

  get sheetfile(): string | undefined {
    return this._sxSheetfile?.value
  }

  set sheetfile(value: string | FootprintSheetfile | undefined) {
    if (value === undefined) {
      this._sxSheetfile = undefined
      return
    }
    this._sxSheetfile =
      value instanceof FootprintSheetfile
        ? value
        : new FootprintSheetfile(value)
  }

  get embeddedFonts(): EmbeddedFonts | undefined {
    return this._sxEmbeddedFonts
  }

  set embeddedFonts(value: EmbeddedFonts | undefined) {
    this._sxEmbeddedFonts = value
  }

  get properties(): Property[] {
    return [...this._properties]
  }

  set properties(value: Property[]) {
    this._properties = [...value]
  }

  get fpTexts(): FpText[] {
    return [...this._fpTexts]
  }

  set fpTexts(value: FpText[]) {
    this._fpTexts = [...value]
  }

  get fpTextBoxes(): FpTextBox[] {
    return [...this._fpTextBoxes]
  }

  set fpTextBoxes(value: FpTextBox[]) {
    this._fpTextBoxes = [...value]
  }

  get fpLines(): FpLine[] {
    return [...this._fpLines]
  }

  set fpLines(value: FpLine[]) {
    this._fpLines = [...value]
  }

  get fpRects(): FpRect[] {
    return [...this._fpRects]
  }

  set fpRects(value: FpRect[]) {
    this._fpRects = [...value]
  }

  get fpCircles(): FpCircle[] {
    return [...this._fpCircles]
  }

  set fpCircles(value: FpCircle[]) {
    this._fpCircles = [...value]
  }

  get fpArcs(): FpArc[] {
    return [...this._fpArcs]
  }

  set fpArcs(value: FpArc[]) {
    this._fpArcs = [...value]
  }

  get fpPolys(): FpPoly[] {
    return [...this._fpPolys]
  }

  set fpPolys(value: FpPoly[]) {
    this._fpPolys = [...value]
  }

  get fpPads(): FootprintPad[] {
    return [...this._fpPads]
  }

  set fpPads(value: FootprintPad[]) {
    this._fpPads = [...value]
  }

  get models(): FootprintModel[] {
    return [...this._models]
  }

  set models(value: FootprintModel[]) {
    this._models = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxPlaced) children.push(this._sxPlaced)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxTedit) children.push(this._sxTedit)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxXy) children.push(this._sxXy)
    if (this._sxDescr) children.push(this._sxDescr)
    if (this._sxTags) children.push(this._sxTags)
    if (this._sxPath) children.push(this._sxPath)
    if (this._sxAutoplaceCost90) children.push(this._sxAutoplaceCost90)
    if (this._sxAutoplaceCost180) children.push(this._sxAutoplaceCost180)
    if (this._sxSolderMaskMargin) children.push(this._sxSolderMaskMargin)
    if (this._sxSolderPasteMargin) children.push(this._sxSolderPasteMargin)
    if (this._sxSolderPasteRatio) children.push(this._sxSolderPasteRatio)
    if (this._sxClearance) children.push(this._sxClearance)
    if (this._sxZoneConnect) children.push(this._sxZoneConnect)
    if (this._sxThermalWidth) children.push(this._sxThermalWidth)
    if (this._sxThermalGap) children.push(this._sxThermalGap)
    if (this._sxAttr) children.push(this._sxAttr)
    if (this._sxPrivateLayers) children.push(this._sxPrivateLayers)
    if (this._sxNetTiePadGroups) children.push(this._sxNetTiePadGroups)
    if (this._sxSheetname) children.push(this._sxSheetname)
    if (this._sxSheetfile) children.push(this._sxSheetfile)
    if (this._sxEmbeddedFonts) children.push(this._sxEmbeddedFonts)
    children.push(...this._properties)
    children.push(...this._fpTexts)
    children.push(...this._fpTextBoxes)
    children.push(...this._fpLines)
    children.push(...this._fpRects)
    children.push(...this._fpCircles)
    children.push(...this._fpArcs)
    children.push(...this._fpPolys)
    children.push(...this._fpPads)
    children.push(...this._models)
    return children
  }

  override getString(): string {
    const lines = ["(footprint"]
    if (this._libraryLink !== undefined) {
      lines.push(`  ${quoteSExprString(this._libraryLink)}`)
    }
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Footprint)
