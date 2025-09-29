import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { PcbGeneralThickness } from "./PcbGeneralThickness"
import { PcbGeneralLegacyTeardrops } from "./PcbGeneralLegacyTeardrops"

const SINGLE_TOKENS = new Set(["thickness", "legacy_teardrops"])

export class PcbGeneral extends SxClass {
  static override token = "general"
  static override parentToken = "kicad_pcb"
  token = "general"

  private _sxThickness?: PcbGeneralThickness
  private _sxLegacyTeardrops?: PcbGeneralLegacyTeardrops

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PcbGeneral {
    const general = new PcbGeneral()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SINGLE_TOKENS.has(token)) {
        throw new Error(`general encountered unsupported child token "${token}"`)
      }
    }

    for (const token of Object.keys(arrayPropertyMap)) {
      throw new Error(`general encountered repeated child token "${token}"`)
    }

    general._sxThickness = propertyMap.thickness as PcbGeneralThickness | undefined
    general._sxLegacyTeardrops = propertyMap.legacy_teardrops as
      | PcbGeneralLegacyTeardrops
      | undefined

    return general
  }

  get thickness(): number | undefined {
    return this._sxThickness?.value
  }

  set thickness(value: number | undefined) {
    this._sxThickness = value === undefined ? undefined : new PcbGeneralThickness(value)
  }

  get legacyTeardrops(): boolean | undefined {
    return this._sxLegacyTeardrops?.enabled
  }

  set legacyTeardrops(value: boolean | undefined) {
    if (value === undefined) {
      this._sxLegacyTeardrops = undefined
      return
    }
    this._sxLegacyTeardrops = new PcbGeneralLegacyTeardrops(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxThickness) children.push(this._sxThickness)
    if (this._sxLegacyTeardrops) children.push(this._sxLegacyTeardrops)
    return children
  }
}
SxClass.register(PcbGeneral)
