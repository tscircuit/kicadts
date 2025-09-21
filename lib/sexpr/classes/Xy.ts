import { SxClass } from "../base-classes/SxClass"

export class Xy extends SxClass {
  static override token = "xy"
  token = "xy"

  x: number
  y: number

  constructor(args: [x: number, y: number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }
}
SxClass.register(Xy)
