import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { LegacySymbolInstancePath } from "./LegacySymbolInstancePath"

export class LegacySymbolInstances extends SxClass {
  static override token = "symbol_instances"
  static override parentToken = "kicad_sch"
  token = "symbol_instances"

  private _paths: LegacySymbolInstancePath[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): LegacySymbolInstances {
    const instances = new LegacySymbolInstances()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => token !== "path",
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `symbol_instances encountered unsupported child token "${unsupportedTokens[0]}"`,
      )
    }
    instances._paths =
      (arrayPropertyMap.path as LegacySymbolInstancePath[]) ?? []
    return instances
  }

  get paths(): LegacySymbolInstancePath[] {
    return [...this._paths]
  }

  set paths(value: LegacySymbolInstancePath[]) {
    this._paths = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._paths]
  }
}
SxClass.register(LegacySymbolInstances)
