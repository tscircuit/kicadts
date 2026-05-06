import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

export class Back extends SingleValueProperty<string> {
  static override token = "back"
  token = "back"
}
SxClass.register(Back)
