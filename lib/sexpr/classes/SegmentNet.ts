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

  constructor(name?: string, id?: number) {
    super()
    this._id = id
    this._name = name
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SegmentNet {
    const first = primitiveSexprs[0]
    const second = primitiveSexprs[1]

    if (typeof first === "number") {
      return new SegmentNet(toStringValue(second), first)
    }

    const name = toStringValue(first)
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
    this._name = value
  }

  toObject(): { id?: number; name?: string } {
    return { id: this._id, name: this._name }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const parts = ["net"]
    if (this._id !== undefined) parts.push(String(this._id))
    if (this._name !== undefined) parts.push(quoteSExprString(this._name))
    return `(${parts.join(" ")})`
  }
}
SxClass.register(SegmentNet)
