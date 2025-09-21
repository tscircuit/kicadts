import { SxClass } from "../base-classes/SxClass"

export class Width extends SxClass {
  static override token = "width"
  token = "width"

  width: number

  constructor(args: [width: number]) {
    super()
    this.width = args[0]
  }

  override getString() {
    return `(width ${this.width})`
  }
}
SxClass.register(Width)
