import { SxClass } from "../base-classes/SxClass"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"
import { Stroke } from "./Stroke"
import { Width } from "./Width"

export class FpRect extends SxClass {
  static override token = "fp_rect"
  static override rawArgs = true
  token = "fp_rect"

  start?: FpRectStart
  end?: FpRectEnd
  layer?: Layer
  stroke?: Stroke
  width?: Width
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
          this.start = new FpRectStart(coords)
          break
        }
        case "end": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.end = new FpRectEnd(coords)
          break
        }
        case "layer": {
          this.layer = new Layer(rest as PrimitiveSExpr[])
          break
        }
        case "stroke": {
          const parsed = strokeFromArgs(rest)
          this.stroke = parsed ?? undefined
          if (!parsed) this.extras.push(arg)
          break
        }
        case "width": {
          this.width = new Width(rest as [number])
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
    const lines = ["(fp_rect"]

    const push = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    push(this.start)
    push(this.end)
    push(this.layer)
    push(this.width)
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
SxClass.register(FpRect)

export class FpRectStart extends SxClass {
  static override token = "start"
  static override parentToken = "fp_rect"
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
SxClass.register(FpRectStart)

export class FpRectEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_rect"
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
SxClass.register(FpRectEnd)
