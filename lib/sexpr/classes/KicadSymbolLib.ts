import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { KicadSymbolLibGenerator } from "./KicadSymbolLibGenerator"
import { KicadSymbolLibVersion } from "./KicadSymbolLibVersion"
import { SchematicSymbol } from "./Symbol"

const SINGLE_CHILD_TOKENS = new Set(["version", "generator"])

const MULTI_CHILD_TOKENS = new Set(["symbol"])

const SUPPORTED_CHILD_TOKENS = new Set([
  ...SINGLE_CHILD_TOKENS,
  ...MULTI_CHILD_TOKENS,
])

export interface KicadSymbolLibConstructorParams {
  version?: number | KicadSymbolLibVersion
  generator?: string | KicadSymbolLibGenerator
  symbols?: SchematicSymbol[]
}

export class KicadSymbolLib extends SxClass {
  static override token = "kicad_symbol_lib"
  token = "kicad_symbol_lib"

  private _sxVersion?: KicadSymbolLibVersion
  private _sxGenerator?: KicadSymbolLibGenerator
  private _symbols: SchematicSymbol[] = []

  constructor(params: KicadSymbolLibConstructorParams = {}) {
    super()

    if (params.version instanceof KicadSymbolLibVersion) {
      this._sxVersion = params.version
    } else if (params.version !== undefined) {
      this.version = params.version
    }

    if (params.generator instanceof KicadSymbolLibGenerator) {
      this._sxGenerator = params.generator
    } else if (params.generator !== undefined) {
      this.generator = params.generator
    }

    if (params.symbols !== undefined) {
      this.symbols = params.symbols
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSymbolLib {
    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `kicad_symbol_lib encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
        )
      }
      if (primitive.length === 0 || typeof primitive[0] !== "string") {
        throw new Error(
          `kicad_symbol_lib encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_CHILD_TOKENS.has(token)) {
        throw new Error(
          `kicad_symbol_lib encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_CHILD_TOKENS.has(token)) {
        throw new Error(
          `kicad_symbol_lib encountered unsupported child token "${token}"`,
        )
      }
      if (!MULTI_CHILD_TOKENS.has(token) && entries.length > 1) {
        throw new Error(
          `kicad_symbol_lib does not support repeated child token "${token}"`,
        )
      }
    }

    return new KicadSymbolLib({
      version: propertyMap.version as KicadSymbolLibVersion | undefined,
      generator: propertyMap.generator as KicadSymbolLibGenerator | undefined,
      symbols: (arrayPropertyMap.symbol as SchematicSymbol[]) ?? [],
    })
  }

  get version(): number | undefined {
    return this._sxVersion?.value
  }

  set version(value: number | undefined) {
    this._sxVersion =
      value === undefined ? undefined : new KicadSymbolLibVersion(value)
  }

  get generator(): string | undefined {
    return this._sxGenerator?.value
  }

  set generator(value: string | undefined) {
    this._sxGenerator =
      value === undefined ? undefined : new KicadSymbolLibGenerator(value)
  }

  get symbols(): SchematicSymbol[] {
    return [...this._symbols]
  }

  set symbols(value: SchematicSymbol[]) {
    this._symbols = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxVersion) children.push(this._sxVersion)
    if (this._sxGenerator) children.push(this._sxGenerator)
    children.push(...this._symbols)
    return children
  }
}
SxClass.register(KicadSymbolLib)
