import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Xy } from "./Xy"
import { Uuid } from "./Uuid"
import { Property } from "./Property"
import { Layer } from "./Layer"
import { FpText } from "./FpText"
import { FpTextBox } from "./FpTextBox"
import { FpRect } from "./FpRect"
import { FpCircle } from "./FpCircle"
import { FpArc } from "./FpArc"
import { FpPoly } from "./FpPoly"

export class Footprint extends SxClass {
  static override token = "footprint"
  static override rawArgs = true
  token = "footprint"

  libraryLink?: string
  locked = false
  placed = false
  layer?: Layer
  tedit?: FootprintTedit
  uuid?: Uuid
  position?: At | Xy
  descr?: FootprintDescr
  tags?: FootprintTags
  properties: Property[] = []
  path?: FootprintPath
  autoplaceCost90?: FootprintAutoplaceCost90
  autoplaceCost180?: FootprintAutoplaceCost180
  solderMaskMargin?: FootprintSolderMaskMargin
  solderPasteMargin?: FootprintSolderPasteMargin
  solderPasteRatio?: FootprintSolderPasteRatio
  clearance?: FootprintClearance
  zoneConnect?: FootprintZoneConnect
  thermalWidth?: FootprintThermalWidth
  thermalGap?: FootprintThermalGap
  attr?: FootprintAttr
  privateLayers?: FootprintPrivateLayers
  netTiePadGroups?: FootprintNetTiePadGroups
  fpTexts: FpText[] = []
  fpTextBoxes: FpTextBox[] = []
  fpRects: FpRect[] = []
  fpCircles: FpCircle[] = []
  fpArcs: FpArc[] = []
  fpPolys: FpPoly[] = []
  extraItems: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (typeof arg === "string") {
        if (!this.libraryLink) {
          this.libraryLink = arg
          continue
        }
        if (arg === "locked") {
          this.locked = true
          continue
        }
        if (arg === "placed") {
          this.placed = true
          continue
        }
        this.extraItems.push(arg)
        continue
      }

      if (!Array.isArray(arg) || arg.length === 0) {
        this.extraItems.push(arg)
        continue
      }

      const [token, ...rest] = arg
      if (typeof token !== "string") {
        this.extraItems.push(arg)
        continue
      }

      switch (token) {
        case "layer":
          this.layer = new Layer(rest as PrimitiveSExpr[])
          break
        case "tedit":
          this.tedit = new FootprintTedit(rest as [string])
          break
        case "uuid":
          this.uuid = new Uuid(rest as [string])
          break
        case "at": {
          const coords = rest.map((value) => Number(value)) as [
            number,
            number,
            number?,
          ]
          this.position = new At(coords)
          break
        }
        case "xy": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.position = new Xy(coords)
          break
        }
        case "descr":
          this.descr = new FootprintDescr(rest as [string])
          break
        case "tags":
          this.tags = new FootprintTags(rest as [string])
          break
        case "property":
          this.properties.push(new Property(rest as [string, string]))
          break
        case "path":
          this.path = new FootprintPath(rest as [string])
          break
        case "autoplace_cost90":
          this.autoplaceCost90 = new FootprintAutoplaceCost90(rest as [number])
          break
        case "autoplace_cost180":
          this.autoplaceCost180 = new FootprintAutoplaceCost180(
            rest as [number],
          )
          break
        case "solder_mask_margin":
          this.solderMaskMargin = new FootprintSolderMaskMargin(
            rest as [number],
          )
          break
        case "solder_paste_margin":
          this.solderPasteMargin = new FootprintSolderPasteMargin(
            rest as [number],
          )
          break
        case "solder_paste_ratio":
          this.solderPasteRatio = new FootprintSolderPasteRatio(
            rest as [number],
          )
          break
        case "clearance":
          this.clearance = new FootprintClearance(rest as [number])
          break
        case "zone_connect":
          this.zoneConnect = new FootprintZoneConnect(rest as [number])
          break
        case "thermal_width":
          this.thermalWidth = new FootprintThermalWidth(rest as [number])
          break
        case "thermal_gap":
          this.thermalGap = new FootprintThermalGap(rest as [number])
          break
        case "attr":
          this.attr = new FootprintAttr(rest as PrimitiveSExpr[])
          break
        case "private_layers":
          this.privateLayers = new FootprintPrivateLayers(
            rest as PrimitiveSExpr[],
          )
          break
        case "net_tie_pad_groups":
          this.netTiePadGroups = new FootprintNetTiePadGroups(
            rest as PrimitiveSExpr[],
          )
          break
        case "fp_text":
          this.fpTexts.push(new FpText(rest as PrimitiveSExpr[]))
          break
        case "fp_text_box":
          this.fpTextBoxes.push(new FpTextBox(rest as PrimitiveSExpr[]))
          break
        case "fp_rect":
          this.fpRects.push(new FpRect(rest as PrimitiveSExpr[]))
          break
        case "fp_circle":
          this.fpCircles.push(new FpCircle(rest as PrimitiveSExpr[]))
          break
        case "fp_arc":
          this.fpArcs.push(new FpArc(rest as PrimitiveSExpr[]))
          break
        case "fp_poly":
          this.fpPolys.push(new FpPoly(rest as PrimitiveSExpr[]))
          break
        default:
          this.extraItems.push(arg)
          break
      }
    }
  }

  override getString(): string {
    const lines = ["(footprint"]

    if (this.libraryLink) {
      lines.push(`  ${quoteSExprString(this.libraryLink)}`)
    }

    if (this.locked) {
      lines.push("  locked")
    }

    if (this.placed) {
      lines.push("  placed")
    }

    const push = (cls?: SxClass | undefined) => {
      if (!cls) return
      const clsLines = cls.getString().split("\n")
      for (const line of clsLines) {
        lines.push(`  ${line}`)
      }
    }

    push(this.layer)
    push(this.tedit)
    push(this.uuid)
    push(this.position)
    push(this.descr)
    push(this.tags)

    for (const property of this.properties) {
      push(property)
    }

    push(this.path)
    push(this.autoplaceCost90)
    push(this.autoplaceCost180)
    push(this.solderMaskMargin)
    push(this.solderPasteMargin)
    push(this.solderPasteRatio)
    push(this.clearance)
    push(this.zoneConnect)
    push(this.thermalWidth)
    push(this.thermalGap)
    push(this.attr)
    push(this.privateLayers)
    push(this.netTiePadGroups)

    for (const fpText of this.fpTexts) {
      push(fpText)
    }

    for (const fpTextBox of this.fpTextBoxes) {
      push(fpTextBox)
    }

    for (const fpRect of this.fpRects) {
      push(fpRect)
    }

    for (const fpCircle of this.fpCircles) {
      push(fpCircle)
    }

    for (const fpArc of this.fpArcs) {
      push(fpArc)
    }

    for (const fpPoly of this.fpPolys) {
      push(fpPoly)
    }

    for (const item of this.extraItems) {
      lines.push(`  ${printSExpr(item)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Footprint)
export class FootprintTedit extends SxClass {
  static override token = "tedit"
  static override parentToken = "footprint"
  token = "tedit"

  value: string

  constructor(args: [string]) {
    super()
    this.value = String(args[0])
  }

  override getString(): string {
    return `(tedit ${this.value})`
  }
}
SxClass.register(FootprintTedit)

export class FootprintDescr extends SxClass {
  static override token = "descr"
  static override parentToken = "footprint"
  token = "descr"

  value: string

  constructor(args: [string]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(descr ${quoteSExprString(this.value)})`
  }
}
SxClass.register(FootprintDescr)

export class FootprintTags extends SxClass {
  static override token = "tags"
  static override parentToken = "footprint"
  token = "tags"

  value: string

  constructor(args: [string]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(tags ${quoteSExprString(this.value)})`
  }
}
SxClass.register(FootprintTags)

export class FootprintPath extends SxClass {
  static override token = "path"
  static override parentToken = "footprint"
  token = "path"

  value: string

  constructor(args: [string]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(path ${quoteSExprString(this.value)})`
  }
}
SxClass.register(FootprintPath)

class FootprintNumberClass extends SxClass {
  value: number
  token: string

  constructor(token: string, args: [number]) {
    super()
    this.token = token
    this.value = Number(args[0])
  }

  override getString(): string {
    return `(${this.token} ${this.value})`
  }
}

export class FootprintAutoplaceCost90 extends FootprintNumberClass {
  static override token = "autoplace_cost90"
  static override parentToken = "footprint"
  override token = "autoplace_cost90"

  constructor(args: [number]) {
    super("autoplace_cost90", args)
  }
}
SxClass.register(FootprintAutoplaceCost90)

export class FootprintAutoplaceCost180 extends FootprintNumberClass {
  static override token = "autoplace_cost180"
  static override parentToken = "footprint"
  override token = "autoplace_cost180"

  constructor(args: [number]) {
    super("autoplace_cost180", args)
  }
}
SxClass.register(FootprintAutoplaceCost180)

export class FootprintSolderMaskMargin extends FootprintNumberClass {
  static override token = "solder_mask_margin"
  static override parentToken = "footprint"
  override token = "solder_mask_margin"

  constructor(args: [number]) {
    super("solder_mask_margin", args)
  }
}
SxClass.register(FootprintSolderMaskMargin)

export class FootprintSolderPasteMargin extends FootprintNumberClass {
  static override token = "solder_paste_margin"
  static override parentToken = "footprint"
  override token = "solder_paste_margin"

  constructor(args: [number]) {
    super("solder_paste_margin", args)
  }
}
SxClass.register(FootprintSolderPasteMargin)

export class FootprintSolderPasteRatio extends FootprintNumberClass {
  static override token = "solder_paste_ratio"
  static override parentToken = "footprint"
  override token = "solder_paste_ratio"

  constructor(args: [number]) {
    super("solder_paste_ratio", args)
  }
}
SxClass.register(FootprintSolderPasteRatio)

export class FootprintClearance extends FootprintNumberClass {
  static override token = "clearance"
  static override parentToken = "footprint"
  override token = "clearance"

  constructor(args: [number]) {
    super("clearance", args)
  }
}
SxClass.register(FootprintClearance)

export class FootprintZoneConnect extends FootprintNumberClass {
  static override token = "zone_connect"
  static override parentToken = "footprint"
  override token = "zone_connect"

  constructor(args: [number]) {
    super("zone_connect", args)
  }
}
SxClass.register(FootprintZoneConnect)

export class FootprintThermalWidth extends FootprintNumberClass {
  static override token = "thermal_width"
  static override parentToken = "footprint"
  override token = "thermal_width"

  constructor(args: [number]) {
    super("thermal_width", args)
  }
}
SxClass.register(FootprintThermalWidth)

export class FootprintThermalGap extends FootprintNumberClass {
  static override token = "thermal_gap"
  static override parentToken = "footprint"
  override token = "thermal_gap"

  constructor(args: [number]) {
    super("thermal_gap", args)
  }
}
SxClass.register(FootprintThermalGap)

export class FootprintAttr extends SxClass {
  static override token = "attr"
  static override parentToken = "footprint"
  static override rawArgs = true
  token = "attr"

  type?: string
  boardOnly = false
  excludeFromPosFiles = false
  excludeFromBom = false
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()
    for (const arg of args) {
      if (typeof arg === "string") {
        switch (arg) {
          case "board_only":
            this.boardOnly = true
            break
          case "exclude_from_pos_files":
            this.excludeFromPosFiles = true
            break
          case "exclude_from_bom":
            this.excludeFromBom = true
            break
          default:
            if (!this.type) {
              this.type = arg
            } else {
              this.extras.push(arg)
            }
            break
        }
      } else {
        this.extras.push(arg)
      }
    }
  }

  override getString(): string {
    const tokens = ["attr"]
    if (this.type) tokens.push(this.type)
    if (this.boardOnly) tokens.push("board_only")
    if (this.excludeFromPosFiles) tokens.push("exclude_from_pos_files")
    if (this.excludeFromBom) tokens.push("exclude_from_bom")
    for (const extra of this.extras) {
      tokens.push(
        typeof extra === "string" || typeof extra === "number"
          ? String(extra)
          : printSExpr(extra),
      )
    }
    return `(${tokens.join(" ")})`
  }
}
SxClass.register(FootprintAttr)

export class FootprintPrivateLayers extends SxClass {
  static override token = "private_layers"
  static override parentToken = "footprint"
  static override rawArgs = true
  token = "private_layers"

  layers: string[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.layers = args.map((arg) => String(arg))
  }

  override getString(): string {
    return `(private_layers ${this.layers.join(" ")})`
  }
}
SxClass.register(FootprintPrivateLayers)

export class FootprintNetTiePadGroups extends SxClass {
  static override token = "net_tie_pad_groups"
  static override parentToken = "footprint"
  static override rawArgs = true
  token = "net_tie_pad_groups"

  groups: string[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.groups = args.map((arg) => String(arg))
  }

  override getString(): string {
    const rendered = this.groups
      .map((group) =>
        group.startsWith('"') && group.endsWith('"')
          ? group
          : quoteSExprString(group),
      )
      .join(" ")
    return `(net_tie_pad_groups ${rendered})`
  }
}
SxClass.register(FootprintNetTiePadGroups)
