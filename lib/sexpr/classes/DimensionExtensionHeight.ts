import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionExtensionHeight extends SxPrimitiveNumber {
  static override token = "extension_height"
  static override parentToken = "style"
  token = "extension_height"
}
SxClass.register(DimensionExtensionHeight)
