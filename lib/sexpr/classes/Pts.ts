import { SxClass } from "../base-classes/SxClass"
import type { Xy } from "./Xy"

export class Pts extends SxClass {
  static override token = "pts"
  token = "pts"

  constructor(args: Array<Xy>, opts?: {}) {
    super()
  }
}
SxClass.register(Pts)
