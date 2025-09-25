import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

const unitValues = ["inches", "mils", "millimeters", "automatic"] as const

export class Unit extends SxClass {
  static override token = "unit"
  token = "unit"

  value: "inches" | "mils" | "millimeters" | "automatic"

  constructor(value: "inches" | "mils" | "millimeters" | "automatic" | number) {
    super()
    if (typeof value === "number") {
      this.value = unitValues[value]!
    } else {
      this.value = value
    }
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Unit {
    const [numericValue] = primitiveSexprs
    return new Unit(numericValue as number)
  }
}
SxClass.register(Unit)
