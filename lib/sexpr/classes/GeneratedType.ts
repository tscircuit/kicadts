import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class GeneratedType extends SxClass {
  static override token = "type"
  static override parentToken = "generated"
  token = "type"
  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GeneratedType {
    const val = toStringValue(primitiveSexprs[0])
    if (val === undefined) {
      throw new Error("generated type expects a string value")
    }
    return new GeneratedType(val)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(type ${this.value})`
  }
}
SxClass.register(GeneratedType)
