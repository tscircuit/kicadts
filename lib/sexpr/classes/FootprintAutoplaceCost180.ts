import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintAutoplaceCost180 extends SxPrimitiveNumber {
  static override token = "autoplace_cost180"
  static override parentToken = "footprint"
  token = "autoplace_cost180"
}
SxClass.register(FootprintAutoplaceCost180)
