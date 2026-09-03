import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class SymbolArcRadiusLength extends SxPrimitiveNumber {
  static override token = "length"
  static override parentToken = "radius"
  token = "length"
}
SxClass.register(SymbolArcRadiusLength)
