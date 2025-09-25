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
import type { Unit, UnitString } from "./Unit"
import type { OnBoard } from "./OnBoard"
import type { InBom } from "./InBom"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class SchematicSymbol extends SxClass {
  static override token = "symbol"
  token = "symbol"

  _sxUnit?: Unit
  _sxInBom?: InBom
  _sxOnBoard?: OnBoard

  libraryIdentifier?: string
  position?: At
  uuid?: Uuid
  properties: SymbolProperty[] = []
  pins: SymbolPin[] = []
  instances?: SymbolInstances
  extras: PrimitiveSExpr[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicSymbol {
    const symbol = new SchematicSymbol()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    symbol._sxUnit = propertyMap.unit as Unit
    symbol._sxInBom = propertyMap.in_bom as InBom
    symbol._sxOnBoard = propertyMap.on_board as OnBoard
    symbol.properties = (arrayPropertyMap.property as SymbolProperty[]) ?? []

    console.log(symbol.properties)

    // TODO

    return symbol
  }

  get unit(): UnitString | undefined {
    return this._sxUnit?.value
  }

  get inBom(): boolean | undefined {
    return this._sxInBom?.value
  }
}
SxClass.register(SchematicSymbol)

export class SymbolPropertyId extends SxPrimitiveNumber {
  static override token = "id"
  static override parentToken = "property"
  token = "id"

  static from(value: number | SymbolPropertyId): SymbolPropertyId {
    if (value instanceof SymbolPropertyId) {
      return value
    }
    return new SymbolPropertyId(value)
  }
}
SxClass.register(SymbolPropertyId)

export class SymbolProperty extends SxClass {
  static override token = "property"
  static override parentToken = "symbol"
  token = "property"

  name: string
  value: string
  _sxId: SymbolPropertyId
  _sxAt: At
  _sxEffects: TextEffects

  constructor(params: {
    name: string
    value: string
    id: number | SymbolPropertyId
    at: At
    effects: TextEffects
  }) {
    super()
    this.name = params.name
    this.value = params.value
    this._sxId = SymbolPropertyId.from(params.id)
    this._sxAt = params.at
    this._sxEffects = params.effects
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolProperty {
    console.log(primitiveSexprs)
    const [key, inputValue, idSexpr, atSexpr, effectsSexpr] = primitiveSexprs

    const name = toStringValue(key)!
    const value = toStringValue(inputValue)!
    const id = SxClass.parsePrimitiveSexpr(idSexpr!, {
      parentToken: "property",
    }) as SymbolPropertyId
    const at = SxClass.parsePrimitiveSexpr(atSexpr!, {
      parentToken: "property",
    }) as At
    const effects = SxClass.parsePrimitiveSexpr(effectsSexpr!, {
      parentToken: "property",
    }) as TextEffects

    return new SymbolProperty({
      name,
      value,
      id,
      at,
      effects,
    })
  }

  get id(): number | undefined {
    return this._sxId?.value
  }

  set id(value: number) {
    this._sxId.value = value
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
