import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class GroupId extends SxPrimitiveString {
  static override token = "id"
  static override parentToken = "group"
  override token = "id"
}
SxClass.register(GroupId)
