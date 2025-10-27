import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class Tstamp extends SxPrimitiveString {
  static override token = "tstamp"
  token = "tstamp"
}
SxClass.register(Tstamp)
