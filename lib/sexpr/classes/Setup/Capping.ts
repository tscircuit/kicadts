import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

export class Capping extends SingleValueProperty<string> {
  static override token = "capping"
  token = "capping"
}
SxClass.register(Capping)
