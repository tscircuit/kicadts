import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class SymbolBodyStyles extends SxPrimitiveString {
  static override token = "body_styles"
  static override parentToken = "symbol"
  token = "body_styles"
}
SxClass.register(SymbolBodyStyles)
