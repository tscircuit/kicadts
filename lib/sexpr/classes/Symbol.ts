import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Uuid } from "./Uuid"
import { TextEffects } from "./TextEffects"
import { toStringValue } from "../utils/toStringValue"
import { toNumberValue } from "../utils/toNumberValue"
import { parseYesNo } from "../utils/parseYesNo"
import { indentLines } from "../utils/indentLines"

export class SchematicSymbol extends SxClass {
  static override token = "symbol"
  token = "symbol"

  libraryIdentifier?: string
  position?: At
  unit?: number
  inBom?: boolean
  onBoard?: boolean
  uuid?: Uuid
  properties: SymbolProperty[] = []
  pins: SymbolPin[] = []
  instances?: SymbolInstances
  extras: PrimitiveSExpr[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicSymbol {
    const symbol = new SchematicSymbol()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    // TODO

    return symbol
  }
}
SxClass.register(SchematicSymbol)

export class SymbolProperty extends SxClass {
  static override token = "property"
  static override parentToken = "symbol"
  token = "property"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolProperty {
    // TODO
    return new SymbolProperty()
  }
}
SxClass.register(SymbolProperty)

export class SymbolPin extends SxClass {
  static override token = "pin"
  static override parentToken = "symbol"
  token = "pin"

  name?: string
  uuid?: Uuid
  extras: PrimitiveSExpr[] = []

  static override fromSexprPrimitives(args: PrimitiveSExpr[]): SymbolPin {
    const symbolPin = new SymbolPin()
    return symbolPin
  }
}
SxClass.register(SymbolPin)

export class SymbolInstances extends SxClass {
  static override token = "instances"
  static override parentToken = "symbol"
  token = "instances"

  static override fromSexprPrimitives(args: PrimitiveSExpr[]): SymbolInstances {
    const symbolInstances = new SymbolInstances()
    return symbolInstances
  }
}
SxClass.register(SymbolInstances)
