import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class PcbLayerDefinition extends SxClass {
  static override token = "__pcb_layer_definition__"
  static override parentToken = "layers"
  token = "__pcb_layer_definition__"

  private _index?: number
  private _name?: string
  private _type?: string
  private _userName?: string

  constructor(options: {
    index?: number
    name?: string
    type?: string
    userName?: string
  }) {
    super()
    this._index = options.index
    this._name = options.name
    this._type = options.type
    this._userName = options.userName
  }

  static fromPrimitive(primitive: PrimitiveSExpr): PcbLayerDefinition {
    if (!Array.isArray(primitive) || primitive.length < 3) {
      throw new Error(
        `layers entry must be an array with at least index, name, and type: ${JSON.stringify(primitive)}`,
      )
    }
    const [rawIndex, rawName, rawType, rawUser] = primitive
    const index = toNumberValue(rawIndex)
    const name = toStringValue(rawName)
    const type = toStringValue(rawType)
    const userName = rawUser === undefined ? undefined : toStringValue(rawUser)

    if (index === undefined || name === undefined || type === undefined) {
      throw new Error(
        `layers entry is missing required values: ${JSON.stringify(primitive)}`,
      )
    }

    return new PcbLayerDefinition({ index, name, type, userName })
  }

  get index(): number | undefined {
    return this._index
  }

  set index(value: number | undefined) {
    this._index = value
  }

  get name(): string | undefined {
    return this._name
  }

  set name(value: string | undefined) {
    this._name = value
  }

  get type(): string | undefined {
    return this._type
  }

  set type(value: string | undefined) {
    this._type = value
  }

  get userName(): string | undefined {
    return this._userName
  }

  set userName(value: string | undefined) {
    this._userName = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (
      this._index === undefined ||
      this._name === undefined ||
      this._type === undefined
    ) {
      return "()"
    }
    const tokens = [
      String(this._index),
      quoteSExprString(this._name),
      this._type,
    ]
    if (this._userName !== undefined) {
      tokens.push(quoteSExprString(this._userName))
    }
    return `(${tokens.join(" ")})`
  }
}
SxClass.register(PcbLayerDefinition)
