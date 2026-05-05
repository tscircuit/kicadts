import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { toStringValue } from "../../utils/toStringValue"
import { Front } from "../Front"
import { Back } from "../Back"

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

  private _sxFront?: Front
  private _sxBack?: Back
  private _sides: string[] = []

  constructor(
    opts: { front?: boolean; back?: boolean; sides?: string[] } = {},
  ) {
    super()
    if (opts.front !== undefined) this._sxFront = new Front(opts.front)
    if (opts.back !== undefined) this._sxBack = new Back(opts.back)
    if (opts.sides !== undefined) this._sides = opts.sides
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SetupTenting {
    const { propertyMap, remaining } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    const sides = remaining
      .map((primitive) => toStringValue(primitive))
      .filter((value): value is string => value !== undefined)

    const tenting = new SetupTenting({ sides })
    tenting._sxFront = propertyMap.front as Front
    tenting._sxBack = propertyMap.back as Back
    return tenting
  }

  get front(): boolean | undefined {
    return this._sxFront?.value
  }

  set front(value: boolean | undefined) {
    this._sxFront = value !== undefined ? new Front(value) : undefined
  }

  get back(): boolean | undefined {
    return this._sxBack?.value
  }

  set back(value: boolean | undefined) {
    this._sxBack = value !== undefined ? new Back(value) : undefined
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
    const childrenStrings = this.getChildren().map((child) =>
      child.getStringIndented(),
    )
    const sidesPart = this._sides.length > 0 ? ` ${this._sides.join(" ")}` : ""

    if (childrenStrings.length === 0) {
      return `(tenting${sidesPart})`
    }

    return `(tenting${sidesPart}\n${childrenStrings.join("\n")}\n)`
  }
}
SxClass.register(SetupTenting)
