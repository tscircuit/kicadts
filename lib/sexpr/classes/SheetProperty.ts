import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { indentLines } from "../utils/indentLines"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { PropertyDoNotAutoplace } from "./PropertyDoNotAutoplace"
import { PropertyShowName } from "./PropertyShowName"
import { TextEffects } from "./TextEffects"
import { SymbolPropertyId as PropertyId } from "./Symbol"

export class SheetProperty extends SxClass {
  static override token = "property"
  static override parentToken = "sheet"
  token = "property"

  key: string
  value: string
  private _sxId?: PropertyId
  private _sxAt?: At
  private _sxShowName?: PropertyShowName
  private _sxDoNotAutoplace?: PropertyDoNotAutoplace
  private _sxEffects?: TextEffects

  constructor(params: {
    key: string
    value: string
    id?: number | PropertyId
    at?: At
    showName?: boolean | PropertyShowName
    doNotAutoplace?: boolean | PropertyDoNotAutoplace
    effects?: TextEffects
  }) {
    super()
    this.key = params.key
    this.value = params.value
    this.id = params.id
    this.at = params.at
    this.showName = params.showName
    this.doNotAutoplace = params.doNotAutoplace
    this.effects = params.effects
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetProperty {
    const [rawKey, rawValue, ...rest] = primitiveSexprs

    const key = toStringValue(rawKey)
    const value = toStringValue(rawValue)

    if (key === undefined || value === undefined) {
      throw new Error("sheet property requires string key and value")
    }

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      rest,
      this.token,
    )

    return new SheetProperty({
      key,
      value,
      id: propertyMap.id as PropertyId | undefined,
      at: propertyMap.at as At | undefined,
      showName: propertyMap.show_name as PropertyShowName | undefined,
      doNotAutoplace: propertyMap.do_not_autoplace as
        | PropertyDoNotAutoplace
        | undefined,
      effects: propertyMap.effects as TextEffects | undefined,
    })
  }

  get id(): number | undefined {
    return this._sxId?.value
  }

  set id(value: number | PropertyId | undefined) {
    if (value === undefined) {
      this._sxId = undefined
      return
    }
    this._sxId = value instanceof PropertyId ? value : new PropertyId(value)
  }

  get idClass(): PropertyId | undefined {
    return this._sxId
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: At | undefined) {
    this._sxAt = value
  }

  get showName(): boolean | undefined {
    return this._sxShowName?.value
  }

  set showName(value: boolean | PropertyShowName | undefined) {
    if (value === undefined) {
      this._sxShowName = undefined
      return
    }
    this._sxShowName =
      value instanceof PropertyShowName ? value : new PropertyShowName(value)
  }

  get doNotAutoplace(): boolean | undefined {
    return this._sxDoNotAutoplace?.value
  }

  set doNotAutoplace(value: boolean | PropertyDoNotAutoplace | undefined) {
    if (value === undefined) {
      this._sxDoNotAutoplace = undefined
      return
    }
    this._sxDoNotAutoplace =
      value instanceof PropertyDoNotAutoplace
        ? value
        : new PropertyDoNotAutoplace(value)
  }

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxId) children.push(this._sxId)
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxShowName) children.push(this._sxShowName)
    if (this._sxDoNotAutoplace) children.push(this._sxDoNotAutoplace)
    if (this._sxEffects) children.push(this._sxEffects)
    return children
  }

  override getString(): string {
    const header = `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)}`
    const bodyLines = this.getChildren().flatMap((child) =>
      indentLines(child.getString()),
    )

    if (bodyLines.length === 0) {
      return `${header})`
    }

    return [header, ...bodyLines, ")"].join("\n")
  }
}
SxClass.register(SheetProperty)
