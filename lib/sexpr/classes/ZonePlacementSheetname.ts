import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZonePlacementSheetname extends SxPrimitiveString {
  static override token = "sheetname"
  static override parentToken = "placement"
  override token = "sheetname"
}
SxClass.register(ZonePlacementSheetname)
