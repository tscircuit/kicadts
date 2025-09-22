import { SxClass } from "../base-classes/SxClass"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"
import { Stroke } from "./Stroke"
import { Width } from "./Width"
import { Pts } from "./Pts"
import { Xy } from "./Xy"

export class FpPoly extends SxClass {
  static override token = "fp_poly"
  static override rawArgs = true
  token = "fp_poly"

  points?: Pts
  layer?: Layer
  width?: Width
  stroke?: Stroke
  fill?: FpPolyFill
  uuid?: Uuid
  locked = false
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    const xyPoints: Xy[] = []

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
        case "pts": {
          const parsed = SxClass.parsePrimitiveSexpr(arg as PrimitiveSExpr)
          if (parsed instanceof Pts) {
            this.points = parsed
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "xy": {
          const parsed = SxClass.parsePrimitiveSexpr(arg as PrimitiveSExpr)
          if (parsed instanceof Xy) {
            xyPoints.push(parsed)
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "layer": {
          this.layer = new Layer(rest as PrimitiveSExpr[])
          break
        }
        case "width": {
          this.width = new Width(rest as [number])
          break
        }
        case "stroke": {
          const parsed = strokeFromArgs(rest)
          this.stroke = parsed ?? undefined
          if (!parsed) this.extras.push(arg)
          break
        }
        case "fill": {
          const fillValue = rest[0]
          if (fillValue === "yes" || fillValue === "no") {
            this.fill = new FpPolyFill([fillValue === "yes"])
          } else {
            this.extras.push(arg)
          }
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

    if (!this.points && xyPoints.length > 0) {
      this.points = new Pts(xyPoints)
    }
  }

  override getString(): string {
    const lines = ["(fp_poly"]

    const push = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    push(this.points)
    push(this.layer)
    push(this.width)
    push(this.stroke)
    push(this.fill)
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
SxClass.register(FpPoly)

export class FpPolyFill extends SxClass {
  static override token = "fill"
  static override parentToken = "fp_poly"
  token = "fill"

  filled: boolean

  constructor(args: [boolean]) {
    super()
    this.filled = args[0]
  }

  override getString(): string {
    return `(fill ${this.filled ? "yes" : "no"})`
  }
}
SxClass.register(FpPolyFill)
