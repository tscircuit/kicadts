import { SxClass } from "../base-classes/SxClass"

export class Uuid extends SxClass {
  static override token = "uuid"
  token = "uuid"

  value: string

  constructor(args: [value: string]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(uuid ${this.value})`
  }
}
SxClass.register(Uuid)
