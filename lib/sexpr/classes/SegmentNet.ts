import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class SegmentNet extends SxClass {
  static override token = "net"
  static override parentToken = "segment"
  override token = "net"

  private _id?: number
  private _name?: string

  constructor(idOrName: number | string, name?: string) {
    super()
    if (typeof idOrName === "number") {
      this._id = idOrName
      this._name = name
      return
    }
    this._name = idOrName
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SegmentNet {
    const [rawId, rawName] = primitiveSexprs
    const id = toNumberValue(rawId)
    if (id !== undefined) {
      const name = rawName === undefined ? undefined : toStringValue(rawName)
      return new SegmentNet(id, name ?? undefined)
    }

    const name = toStringValue(rawId)
    if (name === undefined) {
      throw new Error("net expects a numeric identifier or string name")
    }
    return new SegmentNet(name)
  }

  get id(): number | undefined {
    return this._id
  }

  set id(value: number | undefined) {
    this._id = value
  }

  get name(): string | undefined {
    return this._name
  }

  set name(value: string | undefined) {
    this._name = value === "" ? undefined : value
  }

  toObject(): { id?: number; name?: string } {
    return this._name === undefined
      ? { id: this._id }
      : { id: this._id, name: this._name }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._id === undefined) {
      return `(net ${quoteSExprString(this._name ?? "")})`
    }
    const namePart = this._name ? ` ${quoteSExprString(this._name)}` : ""
    return `(net ${this._id}${namePart})`
  }
}
SxClass.register(SegmentNet)
