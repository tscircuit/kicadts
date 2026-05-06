import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class FootprintDuplicatePadNumbersAreJumpers extends SxPrimitiveString {
  static override token = "duplicate_pad_numbers_are_jumpers"
  static override parentToken = "footprint"
  override token = "duplicate_pad_numbers_are_jumpers"
}
SxClass.register(FootprintDuplicatePadNumbersAreJumpers)
