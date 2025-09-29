import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"

const isSymbol = (value: string) => /^[A-Za-z0-9._-]+$/.test(value)

export class PcbGenerator extends SxPrimitiveString {
  static override token = "generator"
  static override parentToken = "kicad_pcb"
  token = "generator"

  override getString(): string {
    return `(generator ${isSymbol(this.value) ? this.value : quoteSExprString(this.value)})`
  }
}
SxClass.register(PcbGenerator)
