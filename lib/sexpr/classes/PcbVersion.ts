import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PcbVersion extends SxPrimitiveNumber {
  static override token = "version"
  static override parentToken = "kicad_pcb"
  token = "version"
}
SxClass.register(PcbVersion)
