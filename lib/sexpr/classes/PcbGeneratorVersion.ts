import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"
import { quoteIfNeeded } from "../utils/quoteSExprString"

export class PcbGeneratorVersion extends SxPrimitiveString {
  static override token = "generator_version"
  static override parentToken = "kicad_pcb"
  token = "generator_version"

  override getString(): string {
    return `(generator_version ${quoteIfNeeded(this.value)})`
  }
}
SxClass.register(PcbGeneratorVersion)
