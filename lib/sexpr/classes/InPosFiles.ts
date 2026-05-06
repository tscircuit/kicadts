import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class InPosFiles extends SxPrimitiveBoolean {
  static override token = "in_pos_files"
  token = "in_pos_files"
}
SxClass.register(InPosFiles)
