import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintAutoplaceCost90 extends SxPrimitiveNumber {
  static override token = "autoplace_cost90"
  static override parentToken = "footprint"
  token = "autoplace_cost90"
}
SxClass.register(FootprintAutoplaceCost90)
