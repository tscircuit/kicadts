import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { FootprintUnitName } from "./FootprintUnitName"
import { FootprintUnitPins } from "./FootprintUnitPins"

export class FootprintUnit extends SxClass {
  static override token = "unit"
  static override parentToken = "units"
  override token = "unit"

  private _sxName?: FootprintUnitName
  private _sxPins?: FootprintUnitPins

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintUnit {
    const unit = new FootprintUnit()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    unit._sxName = propertyMap.name as FootprintUnitName | undefined
    unit._sxPins = propertyMap.pins as FootprintUnitPins | undefined
    return unit
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxName) children.push(this._sxName)
    if (this._sxPins) children.push(this._sxPins)
    return children
  }
}
SxClass.register(FootprintUnit)
