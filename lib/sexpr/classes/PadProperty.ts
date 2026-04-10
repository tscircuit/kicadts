import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

const primitiveToValue = (
  primitive: PrimitiveSExpr | undefined,
): string | undefined => {
  if (primitive === undefined) {
    return undefined
  }
  const stringValue = toStringValue(primitive)
  if (stringValue !== undefined) {
    return stringValue
  }
  return printSExpr(primitive)
}

export class PadProperty extends SxClass {
  static override token = "property"
  static override parentToken = "pad"
  token = "property"

  private _value: string

  constructor(value: string) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadProperty {
    if (primitiveSexprs.length !== 1) {
      throw new Error("pad property expects exactly one value")
    }

    const value = primitiveToValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("pad property expects a printable value")
    }

    return new PadProperty(value)
  }

  get value(): string {
    return this._value
  }

  set value(value: string) {
    this._value = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(property ${printSExpr(this._value)})`
  }
}
SxClass.register(PadProperty)
