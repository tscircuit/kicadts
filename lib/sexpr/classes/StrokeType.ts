import { SxClass } from "../base-classes/SxClass"

export type StrokeTypeString =
  | "dash"
  | "dash_dot"
  | "dash_dot_dot"
  | "dot"
  | "default"
  | "solid"

export class StrokeType extends SxClass {
  static override token = "type"
  static override parentToken = "stroke"
  token = "type"

  type: StrokeTypeString

  constructor(args: [type: StrokeTypeString]) {
    super()
    this.type = args[0]
  }

  override getString() {
    return `(type ${this.type})`
  }
}
SxClass.register(StrokeType)
