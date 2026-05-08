import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"

export class PropertyDoNotAutoplace extends SxPrimitiveBoolean {
  static override token = "do_not_autoplace"
  static override parentToken = "property"
  token = "do_not_autoplace"
}
SxClass.register(PropertyDoNotAutoplace)
