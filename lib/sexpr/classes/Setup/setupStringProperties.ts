import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { toStringValue } from "../../utils/toStringValue"

import { Back } from "./Back"
import { Front } from "./Front"
import { SingleValueProperty } from "./base"

abstract class SetupStringProperty extends SingleValueProperty<string> {
  static override parentToken = "setup"
}

export class SetupZone45Only extends SetupStringProperty {
  static override token = "zone_45_only"
  token = "zone_45_only"
}
SxClass.register(SetupZone45Only)

export class SetupAllowSoldermaskBridgesInFootprints extends SetupStringProperty {
  static override token = "allow_soldermask_bridges_in_footprints"
  token = "allow_soldermask_bridges_in_footprints"
}
SxClass.register(SetupAllowSoldermaskBridgesInFootprints)

export class SetupVisibleElements extends SetupStringProperty {
  static override token = "visible_elements"
  token = "visible_elements"
}
SxClass.register(SetupVisibleElements)

export class SetupUviasAllowed extends SetupStringProperty {
  static override token = "uvias_allowed"
  token = "uvias_allowed"
}
SxClass.register(SetupUviasAllowed)

export class SetupTenting extends SxClass {
  static override token = "tenting"
  static override parentToken = "setup"
  token = "tenting"

  private _sides: string[] = []
  private _sxFront?: Front
  private _sxBack?: Back

  constructor(sides: string[] = []) {
    super()
    this.sides = sides
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SetupTenting {
    if (primitiveSexprs.some((primitive) => Array.isArray(primitive))) {
      const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
        primitiveSexprs,
        this.token,
      )

      const tenting = new SetupTenting()
      tenting._sxFront = propertyMap.front as Front | undefined
      tenting._sxBack = propertyMap.back as Back | undefined
      return tenting
    }

    const sides = primitiveSexprs
      .map((primitive) => toStringValue(primitive))
      .filter((value): value is string => value !== undefined)
    return new SetupTenting(sides)
  }

  get sides(): string[] {
    return [...this._sides]
  }

  set sides(sides: string[]) {
    this._sides = sides.map((side) => String(side))
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxFront) children.push(this._sxFront)
    if (this._sxBack) children.push(this._sxBack)
    return children
  }

  override getString(): string {
    if (this._sxFront || this._sxBack) {
      return super.getString()
    }
    if (this._sides.length === 0) {
      return "(tenting)"
    }
    return `(tenting ${this._sides.join(" ")})`
  }
}
SxClass.register(SetupTenting)
