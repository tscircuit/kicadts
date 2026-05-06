import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"

export class PropertyShowName extends SxPrimitiveBoolean {
  static override token = "show_name"
  static override parentToken = "property"
  token = "show_name"
}
SxClass.register(PropertyShowName)
