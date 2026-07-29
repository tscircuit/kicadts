import { SxClass } from "../base-classes/SxClass"
import { Footprint } from "./Footprint"

/**
 * Compatibility root for footprint files written before KiCad 6.
 *
 * Footprint.getString() intentionally serializes this as the modern
 * `footprint` token.
 */
export class LegacyFootprintModule extends Footprint {
  static override token = "module"
  override token = "module"
}
SxClass.register(LegacyFootprintModule)
