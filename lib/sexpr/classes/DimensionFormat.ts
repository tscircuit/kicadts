import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import "./DimensionFormatOverrideValue"
import "./DimensionFormatPrecision"
import "./DimensionFormatPrefix"
import "./DimensionFormatSuffix"
import "./DimensionFormatSuppressZeros"
import "./DimensionFormatUnits"
import "./DimensionFormatUnitsFormat"
import type { DimensionFormatOverrideValue } from "./DimensionFormatOverrideValue"
import type { DimensionFormatPrecision } from "./DimensionFormatPrecision"
import type { DimensionFormatPrefix } from "./DimensionFormatPrefix"
import type { DimensionFormatSuffix } from "./DimensionFormatSuffix"
import type { DimensionFormatSuppressZeros } from "./DimensionFormatSuppressZeros"
import type { DimensionFormatUnits } from "./DimensionFormatUnits"
import type { DimensionFormatUnitsFormat } from "./DimensionFormatUnitsFormat"

const SUPPORTED_TOKENS = new Set([
  "prefix",
  "suffix",
  "units",
  "units_format",
  "precision",
  "override_value",
  "suppress_zeros",
])

export class DimensionFormat extends SxClass {
  static override token = "format"
  static override parentToken = "dimension"
  token = "format"

  private _sxPrefix?: DimensionFormatPrefix
  private _sxSuffix?: DimensionFormatSuffix
  private _sxUnits?: DimensionFormatUnits
  private _sxUnitsFormat?: DimensionFormatUnitsFormat
  private _sxPrecision?: DimensionFormatPrecision
  private _sxOverrideValue?: DimensionFormatOverrideValue
  private _sxSuppressZeros?: DimensionFormatSuppressZeros

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DimensionFormat {
    const format = new DimensionFormat()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`format does not support child token "${token}"`)
      }
      if (arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `format does not support repeated child token "${token}"`,
        )
      }
    }

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `format encountered unexpected primitive child ${JSON.stringify(primitive)}`,
        )
      }
    }

    format._sxPrefix = propertyMap.prefix as DimensionFormatPrefix | undefined
    format._sxSuffix = propertyMap.suffix as DimensionFormatSuffix | undefined
    format._sxUnits = propertyMap.units as DimensionFormatUnits | undefined
    format._sxUnitsFormat = propertyMap.units_format as
      | DimensionFormatUnitsFormat
      | undefined
    format._sxPrecision = propertyMap.precision as
      | DimensionFormatPrecision
      | undefined
    format._sxOverrideValue = propertyMap.override_value as
      | DimensionFormatOverrideValue
      | undefined
    format._sxSuppressZeros = propertyMap.suppress_zeros as
      | DimensionFormatSuppressZeros
      | undefined

    if (!format._sxUnits) {
      throw new Error("format requires a units child token")
    }
    if (!format._sxUnitsFormat) {
      throw new Error("format requires a units_format child token")
    }
    if (!format._sxPrecision) {
      throw new Error("format requires a precision child token")
    }

    return format
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPrefix) children.push(this._sxPrefix)
    if (this._sxSuffix) children.push(this._sxSuffix)
    if (this._sxUnits) children.push(this._sxUnits)
    if (this._sxUnitsFormat) children.push(this._sxUnitsFormat)
    if (this._sxPrecision) children.push(this._sxPrecision)
    if (this._sxOverrideValue) children.push(this._sxOverrideValue)
    if (this._sxSuppressZeros) children.push(this._sxSuppressZeros)
    return children
  }
}
SxClass.register(DimensionFormat)
