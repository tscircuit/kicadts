import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class EmbeddedFileChecksum extends SxPrimitiveString {
  static override token = "checksum"
  static override parentToken = "file"
  token = "checksum"
}
SxClass.register(EmbeddedFileChecksum)
