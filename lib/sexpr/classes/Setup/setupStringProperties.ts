import { SxClass } from "../../base-classes/SxClass"
import { type PrimitiveSExpr } from "../../parseToPrimitiveSExpr"

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
  static override rawArgs = true
  token = "tenting"

  sides: string[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.sides = args.filter((side): side is string => typeof side === "string")
  }

  override getString(): string {
    return `(tenting ${this.sides.join(" ")})`
  }
}
SxClass.register(SetupTenting)

