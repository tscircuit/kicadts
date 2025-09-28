import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SchematicSymbol } from "./Symbol"

const SUPPORTED_ARRAY_TOKENS = new Set(["symbol"])

export class LibSymbols extends SxClass {
  static override token = "lib_symbols"
  static override parentToken = "kicad_sch"
  override token = "lib_symbols"

  private _symbols: SchematicSymbol[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): LibSymbols {
    const libSymbols = new LibSymbols()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    if (Object.keys(propertyMap).length > 0) {
      const tokens = Object.keys(propertyMap).join(", ")
      throw new Error(
        `Unsupported singular child tokens inside lib_symbols expression: ${tokens}`,
      )
    }

    const unsupportedArrayTokens = Object.keys(arrayPropertyMap).filter(
      (token) => !SUPPORTED_ARRAY_TOKENS.has(token),
    )
    if (unsupportedArrayTokens.length > 0) {
      throw new Error(
        `Unsupported repeated child tokens inside lib_symbols expression: ${unsupportedArrayTokens.join(", ")}`,
      )
    }

    libSymbols._symbols = (arrayPropertyMap.symbol as SchematicSymbol[]) ?? []

    return libSymbols
  }

  get symbols(): SchematicSymbol[] {
    return [...this._symbols]
  }

  set symbols(value: SchematicSymbol[]) {
    this._symbols = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._symbols]
  }
}
SxClass.register(LibSymbols)
