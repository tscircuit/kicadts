import { TextEffects, Uuid, type At } from "lib/sexpr"
import { SxClass } from "lib/sexpr/base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "lib/sexpr/parseToPrimitiveSExpr"
import { indentLines } from "lib/sexpr/utils/indentLines"
import { quoteSExprString } from "lib/sexpr/utils/quoteSExprString"
import { toNumberValue } from "lib/sexpr/utils/toNumberValue"
import { toStringValue } from "lib/sexpr/utils/toStringValue"

export class SheetPin extends SxClass {
  static override token = "pin"
  static override parentToken = "sheet"
  static override rawArgs = true
  token = "pin"

  name?: string
  electricalType?: string
  position?: At
  effects?: TextEffects
  uuid?: Uuid
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()
    if (args.length === 0) {
      throw new Error("sheet pin requires at least a name")
    }

    this.name = toStringValue(args[0]) ?? undefined
    let index = this.name !== undefined ? 1 : 0

    if (index < args.length) {
      const electrical = toStringValue(args[index])
      if (electrical && !Array.isArray(args[index])) {
        this.electricalType = electrical
        index++
      }
    }

    for (const arg of args.slice(index)) {
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
          const coords = rest
            .map((value) => toNumberValue(value))
            .filter((value): value is number => value !== undefined)
          if (coords.length >= 2) {
            this.position = new At(coords as [number, number, number?])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "effects": {
          const parsed = SxClass.parsePrimitiveSexpr([
            "effects",
            ...rest,
          ] as PrimitiveSExpr)
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
    }
  }

  override getString(): string {
    let header = "(pin"
    if (this.name !== undefined) {
      header += ` ${quoteSExprString(this.name)}`
    }
    if (this.electricalType) {
      header += ` ${this.electricalType}`
    }

    const body: string[] = []
    if (this.position) body.push(this.position.getString())
    if (this.effects) body.push(this.effects.getString())
    if (this.uuid) body.push(this.uuid.getString())
    for (const extra of this.extras) {
      body.push(printSExpr(extra))
    }

    if (body.length === 0) {
      return `${header})`
    }

    const lines = [header]
    for (const entry of body) {
      lines.push(...indentLines(entry))
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SheetPin)
