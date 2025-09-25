import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Xy } from "./Xy"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { parseYesNo } from "../utils/parseYesNo"

export class GrText extends SxClass {
  static override token = "gr_text"
  static override rawArgs = true
  token = "gr_text"

  text = ""
  position?: At | Xy
  layer?: Layer
  locked = false
  effects?: TextEffects
  uuid?: Uuid
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    let capturedText = false

    for (const arg of args) {
      if (typeof arg === "string") {
        if (!capturedText) {
          this.text = arg
          capturedText = true
          continue
        }
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
    const lines = ["(gr_text"]

    lines.push(`  ${quoteSExprString(this.text)}`)

    const push = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    if (this.position) {
      push(this.position)
    }

    if (this.layer) {
      push(this.layer)
    }

    if (this.locked) {
      lines.push("  (locked yes)")
    }

    if (this.effects) {
      push(this.effects)
    }

    if (this.uuid) {
      push(this.uuid)
    }

    for (const extra of this.extras) {
      lines.push(`  ${printSExpr(extra)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(GrText)
