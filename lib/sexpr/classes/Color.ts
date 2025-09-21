import { SxClass } from "../base-classes/SxClass"

export type RGBAColor = { r: number; g: number; b: number; a: number }

export class Color extends SxClass {
  static override token = "color"
  token = "color"

  color: RGBAColor

  constructor(args: [r: number, g: number, b: number, a: number]) {
    super()
    this.color = { r: args[0], g: args[1], b: args[2], a: args[3] }
  }
}
SxClass.register(Color)
