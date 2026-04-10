import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class EmbeddedFileType extends SxPrimitiveString {
  static override token = "type"
  static override parentToken = "file"
  token = "type"
}
SxClass.register(EmbeddedFileType)
