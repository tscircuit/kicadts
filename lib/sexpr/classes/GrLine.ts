import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { parseYesNo } from "../utils/parseYesNo"

interface GrLinePoint {
  x: number
  y: number
}

export class GrLine extends SxClass {
  static override token = "gr_line"
  static override rawArgs = true
  token = "gr_line"

  start?: GrLinePoint
  end?: GrLinePoint
  angle?: number
  layer?: Layer
  width?: Width
  stroke?: Stroke
  uuid?: Uuid
  locked = false
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
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
          const x = toNumberValue(rest[0])
          const y = toNumberValue(rest[1])
          if (x !== undefined && y !== undefined) {
            this.start = { x, y }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "end": {
          const x = toNumberValue(rest[0])
          const y = toNumberValue(rest[1])
          if (x !== undefined && y !== undefined) {
            this.end = { x, y }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "angle": {
          const value = toNumberValue(rest[0])
          if (value !== undefined) {
            this.angle = value
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
          const width = toNumberValue(rest[0])
          if (width !== undefined) {
            this.width = new Width([width])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "stroke": {
          const stroke = strokeFromArgs(rest as PrimitiveSExpr[])
          if (stroke) {
            this.stroke = stroke
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "uuid": {
          const value = toStringValue(rest[0])
          if (value !== undefined) {
            this.uuid = new Uuid([value])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "locked": {
          const value = parseYesNo(rest[0])
          if (value !== undefined) {
            this.locked = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        default:
          this.extras.push(arg)
          break
      }
    }
  }

  override getString(): string {
    const lines = ["(gr_line"]

    const pushLine = (value: string | SxClass | undefined) => {
      if (!value) return
      if (typeof value === "string") {
        lines.push(`  ${value}`)
        return
      }
      const parts = value.getString().split("\n")
      for (const part of parts) {
        lines.push(`  ${part}`)
      }
    }

    if (this.start) {
      pushLine(`(start ${this.start.x} ${this.start.y})`)
    }

    if (this.end) {
      pushLine(`(end ${this.end.x} ${this.end.y})`)
    }

    if (this.angle !== undefined) {
      pushLine(`(angle ${this.angle})`)
    }

    if (this.stroke) {
      pushLine(this.stroke)
    }

    if (this.width) {
      pushLine(this.width)
    }

    if (this.locked) {
      pushLine("(locked yes)")
    }

    if (this.layer) {
      pushLine(this.layer)
    }

    if (this.uuid) {
      pushLine(this.uuid)
    }

    for (const extra of this.extras) {
      pushLine(printSExpr(extra))
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(GrLine)
