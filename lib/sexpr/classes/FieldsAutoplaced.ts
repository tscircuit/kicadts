import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class FieldsAutoplaced extends SxPrimitiveBoolean {
  static override token = "fields_autoplaced"
  token = "fields_autoplaced"

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): FieldsAutoplaced {
    if (primitives.length === 0) return new FieldsAutoplaced(true)
    return super.fromSexprPrimitives(primitives) as FieldsAutoplaced
  }
}
SxClass.register(FieldsAutoplaced)
