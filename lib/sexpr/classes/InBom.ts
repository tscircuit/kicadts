import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class InBom extends SxPrimitiveBoolean {
  static override token = "in_bom"
  token = "in_bom"
}
SxClass.register(InBom)
