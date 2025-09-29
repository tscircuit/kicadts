import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"

const isSymbol = (value: string) => /^[A-Za-z0-9._-]+$/.test(value)

export class PcbGeneratorVersion extends SxPrimitiveString {
  static override token = "generator_version"
  static override parentToken = "kicad_pcb"
  token = "generator_version"

  override getString(): string {
    return `(generator_version ${isSymbol(this.value) ? this.value : quoteSExprString(this.value)})`
  }
}
SxClass.register(PcbGeneratorVersion)
