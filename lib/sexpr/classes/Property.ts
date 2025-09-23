import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"

export class Property extends SxClass {
  static override token = "property"
  static override rawArgs = true
  token = "property"

  key: string
  value: string

  constructor(args: [key: string, value: string]) {
    super()
    this.key = args[0]
    this.value = args[1]
  }

  override getString(): string {
    return `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)})`
  }
}
SxClass.register(Property)
