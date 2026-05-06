import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

export class Front extends SingleValueProperty<string> {
  static override token = "front"
  token = "front"
}
SxClass.register(Front)
