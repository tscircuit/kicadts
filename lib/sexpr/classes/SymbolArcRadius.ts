import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At, type AtInput } from "./At"
import { SymbolArcRadiusAngles } from "./SymbolArcRadiusAngles"
import { SymbolArcRadiusLength } from "./SymbolArcRadiusLength"

export interface SymbolArcRadiusConstructorParams {
  at?: AtInput
  length?: number
  angles?: SymbolArcRadiusAngles | [start: number, end: number]
}

export class SymbolArcRadius extends SxClass {
  static override token = "radius"
  static override parentToken = "arc"
  token = "radius"

  private _sxAt?: At
  private _sxLength?: SymbolArcRadiusLength
  private _sxAngles?: SymbolArcRadiusAngles

  constructor(params: SymbolArcRadiusConstructorParams = {}) {
    super()
    if (params.at !== undefined) this.at = params.at
    if (params.length !== undefined) this.length = params.length
    if (params.angles !== undefined) this.angles = params.angles
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolArcRadius {
    const radius = new SymbolArcRadius()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )
    radius._sxAt = propertyMap.at as At
    radius._sxLength = propertyMap.length as SymbolArcRadiusLength
    radius._sxAngles = propertyMap.angles as SymbolArcRadiusAngles
    return radius
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: AtInput | undefined) {
    this._sxAt = value === undefined ? undefined : At.from(value)
  }

  get length(): number | undefined {
    return this._sxLength?.value
  }

  set length(value: number | undefined) {
    this._sxLength =
      value === undefined ? undefined : new SymbolArcRadiusLength(value)
  }

  get angles(): SymbolArcRadiusAngles | undefined {
    return this._sxAngles
  }

  set angles(value:
    | SymbolArcRadiusAngles
    | [start: number, end: number]
    | undefined,) {
    this._sxAngles =
      value === undefined
        ? undefined
        : value instanceof SymbolArcRadiusAngles
          ? value
          : new SymbolArcRadiusAngles(value[0], value[1])
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxLength) children.push(this._sxLength)
    if (this._sxAngles) children.push(this._sxAngles)
    return children
  }
}
SxClass.register(SymbolArcRadius)
