import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { FootprintUnit } from "./FootprintUnit"

export class FootprintUnits extends SxClass {
  static override token = "units"
  static override parentToken = "footprint"
  token = "units"

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

    return new FootprintUnits(
      (arrayPropertyMap.unit as FootprintUnit[] | undefined) ?? [],
    )
  }

  get units(): FootprintUnit[] {
    return [...this._units]
  }

  set units(value: FootprintUnit[]) {
    this._units = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._units]
  }
}
SxClass.register(FootprintUnits)
