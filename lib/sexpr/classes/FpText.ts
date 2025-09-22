import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Xy } from "./Xy"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

export type FpTextType = "reference" | "value" | "user" | string

export class FpText extends SxClass {
  static override token = "fp_text"
  static override rawArgs = true
  token = "fp_text"

  type?: FpTextType
  text = ""
  position?: At | Xy
  unlocked = false
  hidden = false
  layer?: Layer
  effects?: TextEffects
  uuid?: Uuid
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    let capturedType = false
    let capturedText = false

    for (const arg of args) {
      if (typeof arg === "string") {
        if (!capturedType) {
          this.type = arg
          capturedType = true
          continue
        }
        if (!capturedText) {
          this.text = arg
          capturedText = true
          continue
        }
        if (arg === "unlocked") {
          this.unlocked = true
          continue
        }
        if (arg === "hide") {
          this.hidden = true
          continue
        }
        this.extras.push(arg)
        continue
      }

      if (Array.isArray(arg) && arg.length > 0) {
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
            this.layer = new Layer(rest as PrimitiveSExpr[])
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
          default:
            this.extras.push(arg)
            break
        }
        continue
      }

      this.extras.push(arg)
    }
  }

  override getString(): string {
    const lines = ["(fp_text"]

    if (this.type) {
      lines.push(`  ${this.type}`)
    }

    lines.push(`  ${quoteSExprString(this.text)}`)

    const push = (value?: SxClass) => {
      if (!value) return
      const valueLines = value.getString().split("\n")
      for (const line of valueLines) {
        lines.push(`  ${line}`)
      }
    }

    if (this.position) {
      push(this.position)
    }

    if (this.unlocked) {
      lines.push("  unlocked")
    }

    if (this.layer) {
      push(this.layer)
    }

    if (this.hidden) {
      lines.push("  hide")
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
SxClass.register(FpText)
