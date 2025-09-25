import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class Uuid extends SxPrimitiveString {
  static override token = "uuid"
  token = "uuid"
}
SxClass.register(Uuid)
