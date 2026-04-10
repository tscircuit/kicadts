import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class EmbeddedFileName extends SxPrimitiveString {
  static override token = "name"
  static override parentToken = "file"
  token = "name"
}
SxClass.register(EmbeddedFileName)
