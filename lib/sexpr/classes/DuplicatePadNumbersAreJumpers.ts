import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class DuplicatePadNumbersAreJumpers extends SxClass {
  static override token = "duplicate_pad_numbers_are_jumpers"
  token = "duplicate_pad_numbers_are_jumpers"
  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DuplicatePadNumbersAreJumpers {
    const val = toStringValue(primitiveSexprs[0])
    return new DuplicatePadNumbersAreJumpers(val === "yes" || val === "true")
  }

  override getString() {
    return `(duplicate_pad_numbers_are_jumpers ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(DuplicatePadNumbersAreJumpers)
