import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class ZoneFilledAreasThickness extends SxPrimitiveBoolean {
  static override token = "filled_areas_thickness"
  static override parentToken = "zone"
  override token = "filled_areas_thickness"
}
SxClass.register(ZoneFilledAreasThickness)
