import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { ZoneAttrTeardrop } from "./ZoneAttrTeardrop"

export class ZoneAttr extends SxClass {
  static override token = "attr"
  static override parentToken = "zone"
  override token = "attr"

  private _sxTeardrop?: ZoneAttrTeardrop

  constructor(params: { teardrop?: ZoneAttrTeardrop } = {}) {
    super()
    if (params.teardrop !== undefined) this.teardrop = params.teardrop
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneAttr {
    const attr = new ZoneAttr()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (token !== "teardrop") {
        throw new Error(`zone attr encountered unsupported child "${token}"`)
      }
      if (entries.length > 1) {
        throw new Error("zone attr does not support repeated teardrop children")
      }
    }
    attr._sxTeardrop = propertyMap.teardrop as ZoneAttrTeardrop | undefined
    return attr
  }

  get teardrop(): ZoneAttrTeardrop | undefined {
    return this._sxTeardrop
  }

  set teardrop(value: ZoneAttrTeardrop | undefined) {
    this._sxTeardrop = value
  }

  override getChildren(): SxClass[] {
    return this._sxTeardrop ? [this._sxTeardrop] : []
  }
}
SxClass.register(ZoneAttr)
