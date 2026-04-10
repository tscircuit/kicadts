import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"

export class DimensionKeepTextAligned extends SxPrimitiveBoolean {
  static override token = "keep_text_aligned"
  static override parentToken = "style"
  token = "keep_text_aligned"
}
SxClass.register(DimensionKeepTextAligned)
