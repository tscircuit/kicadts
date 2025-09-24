import { SxClass } from "../../base-classes/SxClass"
import { quoteSExprString } from "../../utils/quoteSExprString"

export abstract class SingleValueProperty<
  T extends string | number,
> extends SxClass {
  value: T
  protected quoteStringValue = false

  constructor(args: [value: T]) {
    super()
    this.value = args[0]
  }

  protected formatValue(): string {
    if (typeof this.value === "string") {
      return this.quoteStringValue ? quoteSExprString(this.value) : this.value
    }
    return `${this.value}`
  }

  override getString(): string {
    return `(${this.token} ${this.formatValue()})`
  }
}

export abstract class NumericListProperty extends SxClass {
  values: number[]

  constructor(args: number[]) {
    super()
    this.values = args
  }

  override getString(): string {
    return `(${this.token} ${this.values.join(" ")})`
  }
}

export abstract class CoordinateProperty extends SxClass {
  x: number
  y: number

  constructor(args: [x: number, y: number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }

  override getString(): string {
    return `(${this.token} ${this.x} ${this.y})`
  }
}

