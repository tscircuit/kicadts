import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"
import { quoteSExprString } from "../utils/quoteSExprString"

export class GeneratedMembers extends SxClass {
  static override token = "members"
  static override parentToken = "generated"
  token = "members"
  uuids: string[]

  constructor(uuids: string[] = []) {
    super()
    this.uuids = uuids
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GeneratedMembers {
    const uuids = primitiveSexprs
      .map((p) => toStringValue(p) ?? "")
      .filter((s) => s !== "")
    return new GeneratedMembers(uuids)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const parts = ["(members"]
    for (const uuid of this.uuids) {
      parts.push(quoteSExprString(uuid))
    }
    parts.push(")")
    return parts.join(" ")
  }
}
SxClass.register(GeneratedMembers)
