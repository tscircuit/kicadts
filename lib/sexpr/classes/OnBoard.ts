import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class OnBoard extends SxPrimitiveBoolean {
  static override token = "on_board"
  token = "on_board"
}
SxClass.register(OnBoard)
