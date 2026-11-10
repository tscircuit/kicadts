import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"

export class FootprintGeneratorVersion extends SxPrimitiveString {
  static override token = "generator_version"
  static override parentToken = "footprint"
  token = "generator_version"

  override getString(): string {
    return `(generator_version ${quoteSExprString(this.value)})`
  }
}
SxClass.register(FootprintGeneratorVersion)
