import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { LegacySymbolInstanceFootprint } from "./LegacySymbolInstanceFootprint"
import { LegacySymbolInstanceValue } from "./LegacySymbolInstanceValue"
import type { SymbolInstanceReference, SymbolInstanceUnit } from "./Symbol"

const SUPPORTED_CHILD_TOKENS = new Set([
  "reference",
  "unit",
  "value",
  "footprint",
])

export class LegacySymbolInstancePath extends SxClass {
  static override token = "path"
  static override parentToken = "symbol_instances"
  token = "path"

  private _value = ""
  private _sxReference?: SymbolInstanceReference
  private _sxUnit?: SymbolInstanceUnit
  private _sxValue?: LegacySymbolInstanceValue
  private _sxFootprint?: LegacySymbolInstanceFootprint

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): LegacySymbolInstancePath {
    const [valuePrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("symbol_instances path requires a string identifier")
    }

    const path = new LegacySymbolInstancePath()
    path._value = value
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)
    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_CHILD_TOKENS.has(token)) {
        throw new Error(
          `symbol_instances path encountered unsupported child token "${token}"`,
        )
      }
    }
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_CHILD_TOKENS.has(token)) {
        throw new Error(
          `symbol_instances path encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `symbol_instances path does not support repeated child token "${token}"`,
        )
      }
    }
    path._sxReference = propertyMap.reference as SymbolInstanceReference
    path._sxUnit = propertyMap.unit as SymbolInstanceUnit
    path._sxValue = propertyMap.value as LegacySymbolInstanceValue
    path._sxFootprint = propertyMap.footprint as LegacySymbolInstanceFootprint
    return path
  }

  get value(): string {
    return this._value
  }

  set value(value: string) {
    this._value = value
  }

  get reference(): string | undefined {
    return this._sxReference?.value
  }

  get unit(): number | undefined {
    return this._sxUnit?.value
  }

  get symbolValue(): string | undefined {
    return this._sxValue?.value
  }

  get footprint(): string | undefined {
    return this._sxFootprint?.value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxReference) children.push(this._sxReference)
    if (this._sxUnit) children.push(this._sxUnit)
    if (this._sxValue) children.push(this._sxValue)
    if (this._sxFootprint) children.push(this._sxFootprint)
    return children
  }

  override getString(): string {
    const lines = [`(path ${quoteSExprString(this._value)}`]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(LegacySymbolInstancePath)
