import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export type StrokeTypeString =
  | "dash"
  | "dash_dot"
  | "dash_dot_dot"
  | "dot"
  | "default"
  | "solid"

export class StrokeType extends SxClass {
  static override token = "type"
  static override parentToken = "stroke"
  token = "type"

  type: StrokeTypeString

  constructor(type: StrokeTypeString) {
    super()
    this.type = type
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): StrokeType {
    return new StrokeType(primitiveSexprs[0] as StrokeTypeString)
  }

  override getString() {
    return `(type ${this.type})`
  }
}
SxClass.register(StrokeType)
