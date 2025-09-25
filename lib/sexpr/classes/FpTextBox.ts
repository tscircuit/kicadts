import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { Stroke } from "./Stroke"
import { Pts } from "./Pts"

export class FpTextBox extends SxClass {
  static override token = "fp_text_box"
  static override rawArgs = true
  token = "fp_text_box"

  locked = false
  text = ""
  start?: FpTextBoxStart
  end?: FpTextBoxEnd
  pts?: Pts
  angle?: FpTextBoxAngle
  layer?: Layer
  uuid?: Uuid
  effects?: TextEffects
  stroke?: Stroke
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    let capturedText = false

    for (const arg of args) {
      if (typeof arg === "string") {
        if (arg === "locked") {
          this.locked = true
          continue
        }
        if (!capturedText) {
          this.text = arg
          capturedText = true
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
          this.start = new FpTextBoxStart(coords)
          break
        }
        case "end": {
          const coords = rest.map((value) => Number(value)) as [number, number]
          this.end = new FpTextBoxEnd(coords)
          break
        }
        case "pts": {
          const parsed = SxClass.parsePrimitiveSexpr(arg as PrimitiveSExpr)
          if (parsed instanceof Pts) {
            this.pts = parsed
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "angle": {
          const value = rest[0]
          if (typeof value === "number") {
            this.angle = new FpTextBoxAngle([value])
          } else if (typeof value === "string") {
            const numeric = Number(value)
            if (!Number.isNaN(numeric)) {
              this.angle = new FpTextBoxAngle([numeric])
            }
          }
          if (!this.angle) {
            this.extras.push(arg)
          }
          break
        }
        case "layer": {
          this.layer = Layer.fromSexprPrimitives(rest as PrimitiveSExpr[])
          break
        }
        case "effects": {
          const parsed = SxClass.parsePrimitiveSexpr(arg as PrimitiveSExpr)
          if (parsed instanceof TextEffects) {
            this.effects = parsed
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "uuid": {
          this.uuid = new Uuid(rest as [string])
          break
        }
        case "stroke": {
          const parsed = SxClass.parsePrimitiveSexpr(arg as PrimitiveSExpr)
          if (parsed instanceof Stroke) {
            this.stroke = parsed
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
    const lines = ["(fp_text_box"]

    if (this.locked) {
      lines.push("  locked")
    }

    lines.push(`  ${quoteSExprString(this.text)}`)

    const push = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    push(this.start)
    push(this.end)
    push(this.pts)
    push(this.angle)
    push(this.layer)
    push(this.effects)
    push(this.stroke)
    push(this.uuid)

    for (const extra of this.extras) {
      lines.push(`  ${printSExpr(extra)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FpTextBox)

export class FpTextBoxStart extends SxClass {
  static override token = "start"
  static override parentToken = "fp_text_box"
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
SxClass.register(FpTextBoxStart)

export class FpTextBoxEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_text_box"
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
SxClass.register(FpTextBoxEnd)

export class FpTextBoxAngle extends SxClass {
  static override token = "angle"
  static override parentToken = "fp_text_box"
  token = "angle"

  value: number

  constructor(args: [number]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(angle ${this.value})`
  }
}
SxClass.register(FpTextBoxAngle)
