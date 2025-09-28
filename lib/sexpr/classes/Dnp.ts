import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class Dnp extends SxPrimitiveBoolean {
  static override token = "dnp"
  token = "dnp"
}
SxClass.register(Dnp)
