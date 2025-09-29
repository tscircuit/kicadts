import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class Zone extends SxClass {
  static override token = "zone"
  token = "zone"

  private _rawChildren: PrimitiveSExpr[] = []

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Zone {
    const zone = new Zone()
    zone._rawChildren = [...primitiveSexprs]
    return zone
  }

  get rawChildren(): PrimitiveSExpr[] {
    return [...this._rawChildren]
  }

  set rawChildren(children: PrimitiveSExpr[]) {
    this._rawChildren = [...children]
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const lines = ["(zone"]

    for (const arg of this._rawChildren) {
      lines.push(`  ${printSExpr(arg)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Zone)
