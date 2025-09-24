import { SxClass } from "../base-classes/SxClass"
import { toNumberValue } from "../utils/toNumberValue"

export class PcbVersion extends SxClass {
  static override token = "version"
  static override parentToken = "kicad_pcb"
  override token = "version"

  value: number

  constructor(args: [number | string]) {
    super()
    const parsed = toNumberValue(args[0])
    if (parsed === undefined) {
      throw new Error("version expects a numeric argument")
    }
    this.value = parsed
  }

  override getString(): string {
    return `(version ${this.value})`
  }
}
SxClass.register(PcbVersion)
