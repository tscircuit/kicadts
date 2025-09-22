import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Uuid } from "./Uuid"
import { Property } from "./Property"
import { Width } from "./Width"
import { Stroke } from "./Stroke"

const toNumber = (value: PrimitiveSExpr): number | undefined => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

const toStringValue = (value: PrimitiveSExpr | undefined): string | undefined => {
  if (value === undefined) return undefined
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return undefined
}

type PadSize = { width: number; height: number }
type PadLayers = string[]
type PadDrill = {
  oval: boolean
  diameter: number
  width?: number
  offset?: { x: number; y: number }
  extras: PrimitiveSExpr[]
}
type PadNet = { id: number; name: string }

type NumberMap =
  | "solderMaskMargin"
  | "solderPasteMargin"
  | "solderPasteMarginRatio"
  | "clearance"
  | "zoneConnect"
  | "thermalWidth"
  | "thermalGap"
  | "dieLength"

const numberTokenMap: Record<string, NumberMap> = {
  solder_mask_margin: "solderMaskMargin",
  solder_paste_margin: "solderPasteMargin",
  solder_paste_margin_ratio: "solderPasteMarginRatio",
  clearance: "clearance",
  zone_connect: "zoneConnect",
  thermal_width: "thermalWidth",
  thermal_gap: "thermalGap",
  die_length: "dieLength",
}

export class FootprintPad extends SxClass {
  static override token = "pad"
  static override rawArgs = true
  token = "pad"

  number: string
  padType: string
  shape: string

  locked = false

  at?: At
  size?: PadSize
  drill?: PadDrill
  layers?: PadLayers
  stroke?: Stroke
  width?: Width

  properties: Property[] = []
  net?: PadNet
  uuid?: Uuid

  removeUnusedLayer = false
  keepEndLayers = false

  roundrectRatio?: number
  chamferRatio?: number
  chamferCorners?: string[]

  pinfunction?: string
  pintype?: string

  solderMaskMargin?: number
  solderPasteMargin?: number
  solderPasteMarginRatio?: number
  clearance?: number
  zoneConnect?: number
  thermalWidth?: number
  thermalGap?: number
  dieLength?: number

  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()
    if (args.length < 3) {
      throw new Error("pad requires number, type, and shape")
    }

    const [numberToken, typeToken, shapeToken, ...rest] = args

    const numberString = toStringValue(numberToken)
    const typeString = toStringValue(typeToken)
    const shapeString = toStringValue(shapeToken)

    if (!numberString || !typeString || !shapeString) {
      throw new Error("pad header tokens must be strings")
    }

    this.number = numberString
    this.padType = typeString
    this.shape = shapeString

    for (const arg of rest) {
      if (typeof arg === "string") {
        switch (arg) {
          case "locked":
            this.locked = true
            continue
          case "remove_unused_layer":
            this.removeUnusedLayer = true
            continue
          case "keep_end_layers":
            this.keepEndLayers = true
            continue
          default:
            this.extras.push(arg)
            continue
        }
      }

      if (!Array.isArray(arg) || arg.length === 0) {
        this.extras.push(arg)
        continue
      }

      const [token, ...restArgs] = arg
      if (typeof token !== "string") {
        this.extras.push(arg)
        continue
      }

      if (token in numberTokenMap) {
        const mappedKey = numberTokenMap[token]
        const num = toNumber(restArgs[0])
        if (num !== undefined) {
          this[mappedKey] = num
        } else {
          this.extras.push(arg)
        }
        continue
      }

      switch (token) {
        case "at": {
          const coords = restArgs.map(toNumber).filter((n): n is number => n !== undefined)
          if (coords.length >= 2) {
            this.at = new At(coords as [number, number, number?])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "size": {
          const width = toNumber(restArgs[0])
          const height = toNumber(restArgs[1])
          if (width !== undefined && height !== undefined) {
            this.size = { width, height }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "drill": {
          const drill = parsePadDrill(restArgs as PrimitiveSExpr[])
          if (drill) {
            this.drill = drill
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "layers": {
          this.layers = restArgs
            .map((entry) => toStringValue(entry))
            .filter((name): name is string => Boolean(name))
          break
        }
        case "stroke": {
          const stroke = strokeFromArgs(restArgs as PrimitiveSExpr[])
          if (stroke) {
            this.stroke = stroke
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "width": {
          const num = toNumber(restArgs[0])
          if (num !== undefined) {
            this.width = new Width([num])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "property": {
          const property = SxClass.parsePrimitiveSexpr(arg as PrimitiveSExpr)
          if (property instanceof Property) {
            this.properties.push(property)
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "roundrect_rratio": {
          const num = toNumber(restArgs[0])
          if (num !== undefined) {
            this.roundrectRatio = num
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "chamfer_ratio": {
          const num = toNumber(restArgs[0])
          if (num !== undefined) {
            this.chamferRatio = num
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "chamfer": {
          this.chamferCorners = restArgs
            .map((corner) => toStringValue(corner))
            .filter((corner): corner is string => Boolean(corner))
          break
        }
        case "net": {
          const id = toNumber(restArgs[0])
          const name = toStringValue(restArgs[1])
          if (id !== undefined && name !== undefined) {
            this.net = { id, name }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "uuid": {
          this.uuid = new Uuid(restArgs as [string])
          break
        }
        case "pinfunction": {
          const value = toStringValue(restArgs[0])
          if (value !== undefined) {
            this.pinfunction = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "pintype": {
          const value = toStringValue(restArgs[0])
          if (value !== undefined) {
            this.pintype = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "options":
        case "primitives":
          this.extras.push(arg)
          break
        default:
          this.extras.push(arg)
          break
      }
    }
  }

  override getString(): string {
    const lines = [`(pad ${quoteSExprString(this.number)} ${this.padType} ${this.shape}`]

    const pushLines = (value: string | string[]) => {
      if (!value) return
      if (Array.isArray(value)) {
        for (const line of value) {
          lines.push(`  ${line}`)
        }
      } else {
        lines.push(`  ${value}`)
      }
    }

    if (this.at) pushLines(this.at.getString())
    if (this.size)
      pushLines(`(size ${this.size.width} ${this.size.height})`)
    if (this.drill) pushLines(formatPadDrill(this.drill))
    if (this.layers)
      pushLines(
        `(layers ${this.layers.map((layer) => quoteSExprString(layer)).join(" ")})`,
      )
    if (this.width) pushLines(this.width.getString())
    if (this.stroke) pushLines(this.stroke.getString())

    for (const property of this.properties) {
      pushLines(property.getString())
    }

    if (this.removeUnusedLayer) pushLines("remove_unused_layer")
    if (this.keepEndLayers) pushLines("keep_end_layers")

    if (this.roundrectRatio !== undefined)
      pushLines(`(roundrect_rratio ${this.roundrectRatio})`)
    if (this.chamferRatio !== undefined)
      pushLines(`(chamfer_ratio ${this.chamferRatio})`)
    if (this.chamferCorners?.length)
      pushLines(`(chamfer ${this.chamferCorners.join(" ")})`)

    if (this.net)
      pushLines(`(net ${this.net.id} ${quoteSExprString(this.net.name)})`)

    if (this.pinfunction)
      pushLines(`(pinfunction ${quoteSExprString(this.pinfunction)})`)
    if (this.pintype)
      pushLines(`(pintype ${quoteSExprString(this.pintype)})`)
    if (this.dieLength !== undefined)
      pushLines(`(die_length ${this.dieLength})`)
    if (this.solderMaskMargin !== undefined)
      pushLines(`(solder_mask_margin ${this.solderMaskMargin})`)
    if (this.solderPasteMargin !== undefined)
      pushLines(`(solder_paste_margin ${this.solderPasteMargin})`)
    if (this.solderPasteMarginRatio !== undefined)
      pushLines(`(solder_paste_margin_ratio ${this.solderPasteMarginRatio})`)
    if (this.clearance !== undefined)
      pushLines(`(clearance ${this.clearance})`)
    if (this.zoneConnect !== undefined)
      pushLines(`(zone_connect ${this.zoneConnect})`)
    if (this.thermalWidth !== undefined)
      pushLines(`(thermal_width ${this.thermalWidth})`)
    if (this.thermalGap !== undefined)
      pushLines(`(thermal_gap ${this.thermalGap})`)
    if (this.uuid) pushLines(this.uuid.getString())
    if (this.locked) pushLines("locked")

    for (const extra of this.extras) {
      pushLines(printSExpr(extra))
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FootprintPad)

const parsePadDrill = (args: PrimitiveSExpr[]): PadDrill | undefined => {
  const remaining = [...args]
  const drill: PadDrill = { oval: false, diameter: 0, extras: [] }

  if (remaining[0] === "oval") {
    drill.oval = true
    remaining.shift()
  }

  const diameter = toNumber(remaining.shift() as PrimitiveSExpr)
  if (diameter === undefined) return undefined
  drill.diameter = diameter

  const width = toNumber(remaining[0] as PrimitiveSExpr)
  if (width !== undefined) {
    drill.width = width
    remaining.shift()
  }

  while (remaining.length) {
    const next = remaining.shift()
    if (Array.isArray(next) && next[0] === "offset") {
      const x = toNumber(next[1])
      const y = toNumber(next[2])
      if (x !== undefined && y !== undefined) {
        drill.offset = { x, y }
      } else {
        drill.extras.push(next as PrimitiveSExpr)
      }
    } else if (next !== undefined) {
      drill.extras.push(next as PrimitiveSExpr)
    }
  }

  return drill
}

const formatPadDrill = (drill: PadDrill): string | string[] => {
  const tokens: string[] = []
  if (drill.oval) tokens.push("oval")
  tokens.push(String(drill.diameter))
  if (drill.width !== undefined) tokens.push(String(drill.width))

  if (!drill.offset && drill.extras.length === 0) {
    return `(drill ${tokens.join(" ")})`
  }

  const lines = [`(drill ${tokens.join(" ")}`]
  if (drill.offset) {
    lines.push(`  (offset ${drill.offset.x} ${drill.offset.y})`)
  }
  for (const extra of drill.extras) {
    lines.push(`  ${printSExpr(extra)}`)
  }
  lines.push(")")
  return lines
}
