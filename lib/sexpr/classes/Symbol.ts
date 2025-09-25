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
  _sxAt?: At
  _sxUuid?: Uuid

  libraryId?: string
  properties: SymbolProperty[] = []
  pins: SymbolPin[] = []
  instances?: SymbolInstances
  extras: PrimitiveSExpr[] = []

  get unit(): UnitString | undefined {
    return this._sxUnit?.value
  }

  get inBom(): boolean | undefined {
    return this._sxInBom?.value
  }

  get onBoard(): boolean | undefined {
    return this._sxOnBoard?.value
  }

  get uuid(): string | undefined {
    return this._sxUuid?.value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicSymbol {
    const symbol = new SchematicSymbol()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    symbol.libraryId = toStringValue(primitiveSexprs[0])
    symbol._sxUnit = propertyMap.unit as Unit
    symbol._sxAt = propertyMap.at as At
    symbol._sxInBom = propertyMap.in_bom as InBom
    symbol._sxOnBoard = propertyMap.on_board as OnBoard
    symbol._sxUuid = propertyMap.uuid as Uuid
    symbol.properties = (arrayPropertyMap.property as SymbolProperty[]) ?? []

    return symbol
  }

  override getString() {
    const lines = [`(symbol ${this.libraryId}`]

    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(
      ...this.properties.map((property) => property.getStringIndented()),
    )

    lines.push(")")
    return lines.join("\n")
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

  key: string
  value: string
  _sxId: SymbolPropertyId
  _sxAt: At
  _sxEffects: TextEffects

  constructor(params: {
    key: string
    value: string
    id: number | SymbolPropertyId
    at: At
    effects: TextEffects
  }) {
    super()
    this.key = params.key
    this.value = params.value
    this._sxId = SymbolPropertyId.from(params.id)
    this._sxAt = params.at
    this._sxEffects = params.effects
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolProperty {
    const [inputKey, inputValue, idSexpr, atSexpr, effectsSexpr] =
      primitiveSexprs

    const key = toStringValue(inputKey)!
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
      key,
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

  override getString() {
    const lines = [
      `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)}`,
      `  (id ${this.id})`,
      this._sxAt.getStringIndented(),
      this._sxEffects.getStringIndented(),
      ")",
    ]
    return lines.join("\n")
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
