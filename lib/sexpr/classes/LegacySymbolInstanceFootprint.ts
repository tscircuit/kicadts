import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class LegacySymbolInstanceFootprint extends SxPrimitiveString {
  static override token = "footprint"
  static override parentToken = "path"
  token = "footprint"
}
SxClass.register(LegacySymbolInstanceFootprint)
