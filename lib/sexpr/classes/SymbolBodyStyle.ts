import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class SymbolBodyStyle extends SxPrimitiveNumber {
  static override token = "body_style"
  static override parentToken = "symbol"
  token = "body_style"
}
SxClass.register(SymbolBodyStyle)
