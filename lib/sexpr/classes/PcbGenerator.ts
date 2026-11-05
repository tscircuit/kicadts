import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"
import { quoteIfNeeded } from "../utils/quoteSExprString"

export class PcbGenerator extends SxPrimitiveString {
  static override token = "generator"
  static override parentToken = "kicad_pcb"
  token = "generator"

  override getString(): string {
    return `(generator ${quoteIfNeeded(this.value)})`
  }
}
SxClass.register(PcbGenerator)
