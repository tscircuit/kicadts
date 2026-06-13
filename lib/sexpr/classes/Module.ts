import { SxClass } from "../base-classes/SxClass"
import { Footprint } from "./Footprint"

export class Module extends Footprint {
  static override token = "module"
  override token = "module"
}
SxClass.register(Module)
