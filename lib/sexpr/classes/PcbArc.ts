import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { parseYesNo } from "../utils/parseYesNo"

export interface PcbArcPoint {
  x: number
  y: number
}

export interface PcbArcConstructorParams {
  start?: PcbArcPoint
  mid?: PcbArcPoint
  end?: PcbArcPoint
  width?: number | Width
  layer?: string | Layer
  net?: number | string
  locked?: boolean
  tstamp?: string | Tstamp
  uuid?: string | Uuid
}

export class PcbArc extends SxClass {
  static override token = "arc"
  static override parentToken = "kicad_pcb"
  token = "arc"

  private _start?: PcbArcPoint
  private _mid?: PcbArcPoint
  private _end?: PcbArcPoint
  private _sxWidth?: Width
  private _sxLayer?: Layer
  private _net?: number | string
  private _locked = false
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid

  constructor(params: PcbArcConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.mid !== undefined) this.mid = params.mid
    if (params.end !== undefined) this.end = params.end
    if (params.width !== undefined) this.width = params.width
    if (params.layer !== undefined) this.layer = params.layer
    if (params.net !== undefined) this.net = params.net
    if (params.locked !== undefined) this.locked = params.locked
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PcbArc {
    const arc = new PcbArc()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `arc encountered unsupported child: ${JSON.stringify(primitive)}`,
        )
      }

      const [token, ...args] = primitive
      if (token === "start") {
        arc._start = parsePoint(args, "start")
        continue
      }
      if (token === "mid") {
        arc._mid = parsePoint(args, "mid")
        continue
      }
      if (token === "end") {
        arc._end = parsePoint(args, "end")
        continue
      }
      if (token === "width") {
        arc._sxWidth = new Width(parseNumber(args[0], "width"))
        continue
      }
      if (token === "layer") {
        const layerName = parseLayer(args)
        arc._sxLayer = new Layer([layerName])
        continue
      }
      if (token === "net") {
        arc._net = parseNet(args[0])
        continue
      }
      if (token === "locked") {
        arc._locked = parseLocked(args)
        continue
      }
      if (token === "uuid") {
        arc._sxUuid = new Uuid(parseString(args[0], "uuid"))
        continue
      }
      if (token === "tstamp") {
        arc._sxTstamp = new Tstamp(parseString(args[0], "tstamp"))
        continue
      }

      throw new Error(`arc encountered unsupported child token "${token}"`)
    }

    if (!arc._start || !arc._mid || !arc._end) {
      throw new Error("arc requires start, mid, and end child tokens")
    }
    if (!arc._sxLayer) {
      throw new Error("arc requires a layer child token")
    }

    return arc
  }

  get start(): PcbArcPoint | undefined {
    return this._start ? { ...this._start } : undefined
  }

  set start(value: PcbArcPoint | undefined) {
    this._start = value ? { ...value } : undefined
  }

  get mid(): PcbArcPoint | undefined {
    return this._mid ? { ...this._mid } : undefined
  }

  set mid(value: PcbArcPoint | undefined) {
    this._mid = value ? { ...value } : undefined
  }

  get end(): PcbArcPoint | undefined {
    return this._end ? { ...this._end } : undefined
  }

  set end(value: PcbArcPoint | undefined) {
    this._end = value ? { ...value } : undefined
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  set width(value: number | Width | undefined) {
    if (value === undefined) {
      this._sxWidth = undefined
      return
    }
    this._sxWidth = value instanceof Width ? value : new Width(value)
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: string | Layer | undefined) {
    if (value === undefined) {
      this._sxLayer = undefined
      return
    }
    this._sxLayer = value instanceof Layer ? value : new Layer([value])
  }

  get net(): number | string | undefined {
    return this._net
  }

  set net(value: number | string | undefined) {
    this._net = value
  }

  get locked(): boolean {
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: string | Uuid | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  get tstamp(): Tstamp | undefined {
    return this._sxTstamp
  }

  set tstamp(value: string | Tstamp | undefined) {
    if (value === undefined) {
      this._sxTstamp = undefined
      return
    }
    this._sxTstamp = value instanceof Tstamp ? value : new Tstamp(value)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const lines = ["(arc"]
    if (this._start) lines.push(renderPoint("start", this._start))
    if (this._mid) lines.push(renderPoint("mid", this._mid))
    if (this._end) lines.push(renderPoint("end", this._end))
    if (this._sxWidth) lines.push(this._sxWidth.getStringIndented())
    if (this._locked) lines.push("  (locked yes)")
    if (this._sxLayer) lines.push(this._sxLayer.getStringIndented())
    if (this._net !== undefined) {
      const netValue =
        typeof this._net === "number"
          ? String(this._net)
          : quoteSExprString(this._net)
      lines.push(`  (net ${netValue})`)
    }
    if (this._sxTstamp) lines.push(this._sxTstamp.getStringIndented())
    if (this._sxUuid) lines.push(this._sxUuid.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PcbArc)

function parsePoint(args: PrimitiveSExpr[], label: string): PcbArcPoint {
  if (args.length !== 2) {
    throw new Error(`arc ${label} expects two numeric values`)
  }
  return {
    x: parseNumber(args[0], `${label}.x`),
    y: parseNumber(args[1], `${label}.y`),
  }
}

function parseNumber(value: PrimitiveSExpr | undefined, label: string): number {
  const numeric = toNumberValue(value)
  if (numeric === undefined) {
    throw new Error(`arc ${label} expects a numeric value`)
  }
  return numeric
}

function parseString(value: PrimitiveSExpr | undefined, label: string): string {
  if (typeof value !== "string") {
    throw new Error(`arc ${label} expects a string value`)
  }
  return value
}

function parseNet(value: PrimitiveSExpr | undefined): number | string {
  const numeric = toNumberValue(value)
  if (numeric !== undefined) return numeric

  const stringValue = toStringValue(value)
  if (stringValue !== undefined) return stringValue

  throw new Error("arc net expects a numeric id or string name")
}

function parseLocked(args: PrimitiveSExpr[]): boolean {
  if (args.length === 0) return true
  if (args.length !== 1) {
    throw new Error("arc locked expects at most one value")
  }
  const parsed = parseYesNo(args[0])
  if (parsed === undefined) {
    throw new Error(
      `arc locked expects yes/no, received ${JSON.stringify(args[0])}`,
    )
  }
  return parsed
}

function parseLayer(args: PrimitiveSExpr[]): string {
  if (args.length !== 1) {
    throw new Error("arc layer expects a single string value")
  }
  return parseString(args[0], "layer")
}

function renderPoint(label: string, point: PcbArcPoint): string {
  return `  (${label} ${point.x} ${point.y})`
}
