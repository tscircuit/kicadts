import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set(["at", "size", "stroke", "uuid"])

export class BusEntry extends SxClass {
  static override token = "bus_entry"
  static override parentToken = "kicad_sch"
  override token = "bus_entry"

  private _sxAt?: At
  private _sxSize?: BusEntrySize
  private _sxStroke?: Stroke
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): BusEntry {
    const entry = new BusEntry()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    if (Object.keys(arrayPropertyMap).length > 0) {
      const tokens = Object.keys(arrayPropertyMap).join(", ")
      throw new Error(
        `bus_entry does not support repeated child tokens: ${tokens}`,
      )
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside bus_entry expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    entry._sxAt = propertyMap.at as At | undefined
    entry._sxSize = propertyMap.size as BusEntrySize | undefined
    entry._sxStroke = propertyMap.stroke as Stroke | undefined
    entry._sxUuid = propertyMap.uuid as Uuid | undefined

    return entry
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: At | undefined) {
    this._sxAt = value
  }

  get size(): { x: number; y: number } | undefined {
    return this._sxSize?.toObject()
  }

  set size(value: BusEntrySize | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxSize = undefined
      return
    }
    if (value instanceof BusEntrySize) {
      this._sxSize = value
      return
    }
    this._sxSize = new BusEntrySize(value.x, value.y)
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
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
    if (this._sxSize) children.push(this._sxSize)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(BusEntry)

export class BusEntrySize extends SxClass {
  static override token = "size"
  static override parentToken = "bus_entry"
  override token = "size"

  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): BusEntrySize {
    const [rawX, rawY] = primitiveSexprs
    if (typeof rawX !== "number" || typeof rawY !== "number") {
      throw new Error("bus_entry size expects two numeric arguments")
    }
    return new BusEntrySize(rawX, rawY)
  }

  toObject(): { x: number; y: number } {
    return { x: this._x, y: this._y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(size ${this._x} ${this._y})`
  }
}
SxClass.register(BusEntrySize)
