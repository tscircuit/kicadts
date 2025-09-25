import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class Width extends SxPrimitiveNumber {
  static override token = "width"
  token = "width"
}
SxClass.register(Width)
