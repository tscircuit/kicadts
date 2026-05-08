import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { ZoneAttrTeardropType } from "./ZoneAttrTeardropType"

export class ZoneAttrTeardrop extends SxClass {
  static override token = "teardrop"
  static override parentToken = "attr"
  override token = "teardrop"

  private _sxType?: ZoneAttrTeardropType

  constructor(type?: ZoneAttrTeardropType | string) {
    super()
    this.type = type
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneAttrTeardrop {
    const teardrop = new ZoneAttrTeardrop()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (token !== "type") {
        throw new Error(
          `zone attr teardrop encountered unsupported child "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error("zone attr teardrop does not support repeated type")
      }
    }
    teardrop._sxType = propertyMap.type as ZoneAttrTeardropType | undefined
    return teardrop
  }

  get type(): string | undefined {
    return this._sxType?.value
  }

  set type(value: ZoneAttrTeardropType | string | undefined) {
    this._sxType =
      value === undefined
        ? undefined
        : value instanceof ZoneAttrTeardropType
          ? value
          : new ZoneAttrTeardropType(value)
  }

  override getChildren(): SxClass[] {
    return this._sxType ? [this._sxType] : []
  }
}
SxClass.register(ZoneAttrTeardrop)
