import { SxClass } from "../../base-classes/SxClass"
import { quoteSExprString } from "../../utils/quoteSExprString"
import { toNumberValue } from "../../utils/toNumberValue"
import { toStringValue } from "../../utils/toStringValue"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"

type SingleValuePropertyConstructor<T extends string | number> = new (
  value: T,
) => SingleValueProperty<T>

export abstract class SingleValueProperty<
  T extends string | number,
> extends SxClass {
  protected _value: T
  protected quoteStringValue = false

  constructor(value: T) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SingleValueProperty<string | number> {
    const [valuePrimitive] = primitiveSexprs
    const value = (this as typeof SingleValueProperty).parsePrimitiveValue(
      valuePrimitive,
    )
    const Constructor = this as unknown as SingleValuePropertyConstructor<
      string | number
    >
    return new Constructor(value)
  }

  protected static parsePrimitiveValue(
    value: PrimitiveSExpr | undefined,
  ): string | number {
    const stringValue = toStringValue(value)
    if (stringValue === undefined) {
      throw new Error(`${this.name} expects a primitive value`)
    }
    return stringValue
  }

  get value(): T {
    return this._value
  }

  set value(value: T) {
    this._value = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  protected formatValue(): string {
    if (typeof this._value === "string") {
      return this.quoteStringValue ? quoteSExprString(this._value) : this._value
    }
    return `${this._value}`
  }

  override getString(): string {
    return `(${this.token} ${this.formatValue()})`
  }
}

type NumericListPropertyConstructor = new (
  values: number[],
) => NumericListProperty

export abstract class NumericListProperty extends SxClass {
  protected _values: number[]

  constructor(values: number[]) {
    super()
    this._values = values
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): NumericListProperty {
    const values = primitiveSexprs.map((primitive) => {
      const value = toNumberValue(primitive)
      if (value === undefined) {
        throw new Error(
          `${this.name} expects numeric primitives but received ${primitive}`,
        )
      }
      return value
    })
    const Constructor = this as unknown as NumericListPropertyConstructor
    return new Constructor(values)
  }

  get values(): number[] {
    return [...this._values]
  }

  set values(values: number[]) {
    this._values = [...values]
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(${this.token} ${this._values.join(" ")})`
  }
}

type CoordinatePropertyConstructor = new (
  x: number,
  y: number,
) => CoordinateProperty

export abstract class CoordinateProperty extends SxClass {
  protected _x: number
  protected _y: number

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): CoordinateProperty {
    const [xPrimitive, yPrimitive] = primitiveSexprs
    const x = toNumberValue(xPrimitive)
    const y = toNumberValue(yPrimitive)
    if (x === undefined || y === undefined) {
      throw new Error(`${this.name} expects two numeric values`)
    }
    const Constructor = this as unknown as CoordinatePropertyConstructor
    return new Constructor(x, y)
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(${this.token} ${this._x} ${this._y})`
  }
}
