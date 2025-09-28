import { SxClass } from "../../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { Layer } from "../Layer"
import { Width } from "../Width"
import { Uuid } from "../Uuid"
import { toNumberValue } from "../../utils/toNumberValue"
import { toStringValue } from "../../utils/toStringValue"
import { quoteSExprString } from "../../utils/quoteSExprString"
import { parseYesNo } from "../../utils/parseYesNo"

interface SegmentPoint {
  x: number
  y: number
}

interface SegmentNet {
  id: number
  name?: string
}

export class Segment extends SxClass {
  static override token = "segment"
  static override rawArgs = true
  token = "segment"

  start?: SegmentPoint
  end?: SegmentPoint
  width?: Width
  layer?: Layer
  net?: SegmentNet
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
        case "width": {
          const width = toNumberValue(rest[0])
          if (width !== undefined) {
            this.width = new Width([width])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "layer": {
          this.layer = Layer.fromSexprPrimitives(rest as PrimitiveSExpr[])
          break
        }
        case "net": {
          const id = toNumberValue(rest[0])
          if (id !== undefined) {
            const name = toStringValue(rest[1])
            this.net = name ? { id, name } : { id }
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
    const lines = ["(segment"]

    const pushLine = (value: string) => {
      lines.push(`  ${value}`)
    }

    const pushClass = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    if (this.start) {
      pushLine(`(start ${this.start.x} ${this.start.y})`)
    }

    if (this.end) {
      pushLine(`(end ${this.end.x} ${this.end.y})`)
    }

    if (this.width) {
      pushClass(this.width)
    }

    if (this.layer) {
      pushClass(this.layer)
    }

    if (this.net) {
      const namePart = this.net.name
        ? ` ${quoteSExprString(this.net.name)}`
        : ""
      pushLine(`(net ${this.net.id}${namePart})`)
    }

    if (this.locked) {
      pushLine("(locked yes)")
    }

    if (this.uuid) {
      pushClass(this.uuid)
    }

    for (const extra of this.extras) {
      pushLine(printSExpr(extra))
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Segment)
