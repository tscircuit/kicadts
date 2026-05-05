import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { FootprintUnitName } from "./FootprintUnitName"
import { FootprintUnitPins } from "./FootprintUnitPins"

export class FootprintUnit extends SxClass {
  static override token = "unit"
  static override parentToken = "units"
  token = "unit"

  private _sxName?: FootprintUnitName
  private _sxPins?: FootprintUnitPins

  constructor(opts: { name?: string; pins?: string[] } = {}) {
    super()
    if (opts.name !== undefined) this._sxName = new FootprintUnitName(opts.name)
    if (opts.pins !== undefined) this._sxPins = new FootprintUnitPins(opts.pins)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintUnit {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    const unit = new FootprintUnit()
    unit._sxName = propertyMap.name as FootprintUnitName
    unit._sxPins = propertyMap.pins as FootprintUnitPins
    return unit
  }

  get name(): string | undefined {
    return this._sxName?.value
  }

  set name(value: string | undefined) {
    this._sxName =
      value !== undefined ? new FootprintUnitName(value) : undefined
  }

  get pins(): string[] | undefined {
    return this._sxPins?.values
  }

  set pins(value: string[] | undefined) {
    this._sxPins =
      value !== undefined ? new FootprintUnitPins(value) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxName) children.push(this._sxName)
    if (this._sxPins) children.push(this._sxPins)
    return children
  }
}
SxClass.register(FootprintUnit)
