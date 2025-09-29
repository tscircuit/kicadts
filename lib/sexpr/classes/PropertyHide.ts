import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"

export class PropertyHide extends SxPrimitiveBoolean {
  static override token = "hide"
  static override parentToken = "property"
  token = "hide"
}
SxClass.register(PropertyHide)
