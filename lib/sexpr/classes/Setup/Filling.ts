import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

export class Filling extends SingleValueProperty<string> {
  static override token = "filling"
  token = "filling"
}
SxClass.register(Filling)
