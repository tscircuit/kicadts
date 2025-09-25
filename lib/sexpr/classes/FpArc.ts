import { SxClass } from "../base-classes/SxClass"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class FpArc extends SxClass {
  static override token = "fp_arc"
  token = "fp_arc"

  start?: FpArcStart
  mid?: FpArcMid
  end?: FpArcEnd
  layer?: Layer
  stroke?: Stroke
  uuid?: Uuid
  locked = false
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (typeof arg === "string") {
        if (arg === "locked") {
          this.locked = true
          continue
        }
        this.extras.push(arg)
        continue
      }

      if (!Array.isArray(arg) || arg.length === 0) {
        this.extras.push(arg)
        continue
      }

      const [token, ...rest] = arg
      if (typeof token !== "string") {
        this.extras.push(arg)
        continue
      }

      switch (token) {
        case "start": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.start = new FpArcStart(coords)
          break
        }
        case "mid": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.mid = new FpArcMid(coords)
          break
        }
        case "end": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.end = new FpArcEnd(coords)
          break
        }
        case "layer": {
          this.layer = Layer.fromSexprPrimitives(rest as PrimitiveSExpr[])
          break
        }
        case "stroke": {
          const parsed = strokeFromArgs(rest)
          this.stroke = parsed ?? undefined
          if (!parsed) this.extras.push(arg)
          break
        }
        case "uuid": {
          this.uuid = new Uuid(rest as [string])
          break
        }
        default:
          this.extras.push(arg)
          break
      }
    }
  }

  override getString(): string {
    const lines = ["(fp_arc"]

    const push = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    push(this.start)
    push(this.mid)
    push(this.end)
    push(this.layer)
    push(this.stroke)
    push(this.uuid)

    if (this.locked) {
      lines.push("  locked")
    }

    for (const extra of this.extras) {
      lines.push(`  ${printSExpr(extra)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FpArc)

export class FpArcStart extends SxClass {
  static override token = "start"
  static override parentToken = "fp_arc"
  token = "start"

  x: number
  y: number

  constructor(args: [number, number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(FpArcStart)

export class FpArcMid extends SxClass {
  static override token = "mid"
  static override parentToken = "fp_arc"
  token = "mid"

  x: number
  y: number

  constructor(args: [number, number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }

  override getString(): string {
    return `(mid ${this.x} ${this.y})`
  }
}
SxClass.register(FpArcMid)

export class FpArcEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_arc"
  token = "end"

  x: number
  y: number

  constructor(args: [number, number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(FpArcEnd)
