import { SxClass } from "../base-classes/SxClass"
import { toStringValue } from "../utils/toStringValue"
import { quoteSExprString } from "../utils/quoteSExprString"

const isSymbol = (value: string) => /^[A-Za-z0-9._-]+$/.test(value)

export class PcbGenerator extends SxClass {
  static override token = "generator"
  static override parentToken = "kicad_pcb"
  override token = "generator"

  value: string

  constructor(args: [string]) {
    super()
    const parsed = toStringValue(args[0])
    if (parsed === undefined) {
      throw new Error("generator expects a string argument")
    }
    this.value = parsed
  }

  override getString(): string {
    return `(generator ${isSymbol(this.value) ? this.value : quoteSExprString(this.value)})`
  }
}
SxClass.register(PcbGenerator)
