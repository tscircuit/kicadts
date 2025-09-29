import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintNetTiePadGroups extends SxClass {
  static override token = "net_tie_pad_groups"
  static override parentToken = "footprint"
  token = "net_tie_pad_groups"

  private _groups: string[] = []

  constructor(groups: string[]) {
    super()
    this.groups = groups
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintNetTiePadGroups {
    const groups = primitiveSexprs.map((primitive) => {
      const value = toStringValue(primitive)
      if (value === undefined) {
        throw new Error(
          `net_tie_pad_groups expects string group entries, received ${JSON.stringify(primitive)}`,
        )
      }
      return value
    })
    return new FootprintNetTiePadGroups(groups)
  }

  get groups(): string[] {
    return [...this._groups]
  }

  set groups(values: string[]) {
    this._groups = values.map((value) => String(value))
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const rendered = this._groups
      .map((group) => quoteSExprString(group))
      .join(" ")
    return `(net_tie_pad_groups ${rendered})`
  }
}
SxClass.register(FootprintNetTiePadGroups)
