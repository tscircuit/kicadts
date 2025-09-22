import { SxClass } from "../base-classes/SxClass"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"
import { Stroke } from "./Stroke"
import { Width } from "./Width"

export class FpCircle extends SxClass {
  static override token = "fp_circle"
  static override rawArgs = true
  token = "fp_circle"

  center?: FpCircleCenter
  end?: FpCircleEnd
  layer?: Layer
  width?: Width
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
        case "center": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.center = new FpCircleCenter(coords)
          break
        }
        case "end": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.end = new FpCircleEnd(coords)
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
    const lines = ["(fp_circle"]

    const push = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    push(this.center)
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
SxClass.register(FpCircle)

export class FpCircleCenter extends SxClass {
  static override token = "center"
  static override parentToken = "fp_circle"
  token = "center"

  x: number
  y: number

  constructor(args: [number, number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }

  override getString(): string {
    return `(center ${this.x} ${this.y})`
  }
}
SxClass.register(FpCircleCenter)

export class FpCircleEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_circle"
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
SxClass.register(FpCircleEnd)
