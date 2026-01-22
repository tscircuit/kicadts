import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintVersion extends SxPrimitiveNumber {
  static override token = "version"
  static override parentToken = "footprint"
  token = "version"
}
SxClass.register(FootprintVersion)
