import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"

export class PropertyUnlocked extends SxPrimitiveBoolean {
  static override token = "unlocked"
  static override parentToken = "property"
  token = "unlocked"
}
SxClass.register(PropertyUnlocked)
