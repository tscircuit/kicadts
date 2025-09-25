import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export type UnitString = "inches" | "mils" | "millimeters" | "automatic"

const unitValues = ["inches", "mils", "millimeters", "automatic"] as const

export class Unit extends SxClass {
  static override token = "unit"
  token = "unit"

  value: UnitString

  constructor(value: UnitString | number) {
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
