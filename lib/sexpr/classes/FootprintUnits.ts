import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { FootprintUnit } from "./FootprintUnit"

export class FootprintUnits extends SxClass {
  static override token = "units"
  static override parentToken = "footprint"
  override token = "units"

  private _units: FootprintUnit[] = []

  constructor(units: FootprintUnit[] = []) {
    super()
    this._units = units
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintUnits {
    const { arrayPropertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )
    return new FootprintUnits((arrayPropertyMap.unit as FootprintUnit[]) ?? [])
  }

  override getChildren(): SxClass[] {
    return [...this._units]
  }
}
SxClass.register(FootprintUnits)
