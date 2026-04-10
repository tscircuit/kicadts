import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionExtensionOffset extends SxPrimitiveNumber {
  static override token = "extension_offset"
  static override parentToken = "style"
  token = "extension_offset"
}
SxClass.register(DimensionExtensionOffset)
