import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class FieldsAutoplaced extends SxPrimitiveBoolean {
  static override token = "fields_autoplaced"
  token = "fields_autoplaced"
}
SxClass.register(FieldsAutoplaced)
