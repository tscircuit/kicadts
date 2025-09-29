import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { indentLines } from "../utils/indentLines"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

export type SheetPinElectricalType =
  | "input"
  | "output"
  | "bidirectional"
  | "tri_state"
  | "passive"

const electricalTypes = new Set<SheetPinElectricalType>([
  "input",
  "output",
  "bidirectional",
  "tri_state",
  "passive",
])

export class SheetPin extends SxClass {
  static override token = "pin"
  static override parentToken = "sheet"
  token = "pin"

  name = ""
  electricalType: SheetPinElectricalType = "input"
  private _sxAt?: At
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetPin {
    if (primitiveSexprs.length < 2) {
      throw new Error("sheet pin requires a name and electrical type")
    }

    const [rawName, rawType, ...rest] = primitiveSexprs

    const name = toStringValue(rawName)
    if (name === undefined) {
      throw new Error("sheet pin name must be a string")
    }

    const electricalType = toStringValue(rawType)
    if (
      !electricalType ||
      !electricalTypes.has(electricalType as SheetPinElectricalType)
    ) {
      throw new Error(
        `sheet pin electrical type must be one of: ${Array.from(electricalTypes).join(", ")}`,
      )
    }

    const pin = new SheetPin()
    pin.name = name
    pin.electricalType = electricalType as SheetPinElectricalType

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      rest,
      this.token,
    )

    pin._sxAt = propertyMap.at as At | undefined
    pin._sxEffects = propertyMap.effects as TextEffects | undefined
    pin._sxUuid = propertyMap.uuid as Uuid | undefined

    return pin
  }

  get position(): At | undefined {
    return this._sxAt
  }

  set position(value: At | undefined) {
    this._sxAt = value
  }

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const header = `(pin ${quoteSExprString(this.name)} ${this.electricalType}`
    const bodyLines = this.getChildren().flatMap((child) =>
      indentLines(child.getString()),
    )

    if (bodyLines.length === 0) {
      return `${header})`
    }

    return [header, ...bodyLines, ")"].join("\n")
  }
}
SxClass.register(SheetPin)
