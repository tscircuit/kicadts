import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class ExcludeFromSim extends SxPrimitiveBoolean {
  static override token = "exclude_from_sim"
  token = "exclude_from_sim"
}
SxClass.register(ExcludeFromSim)
