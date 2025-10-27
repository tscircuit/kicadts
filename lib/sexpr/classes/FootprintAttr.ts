import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

const FLAG_TOKENS = new Set([
  "board_only",
  "exclude_from_pos_files",
  "exclude_from_bom",
  "allow_soldermask_bridges",
])

export class FootprintAttr extends SxClass {
  static override token = "attr"
  static override parentToken = "footprint"
  token = "attr"

  private _type?: string
  private _boardOnly = false
  private _excludeFromPosFiles = false
  private _excludeFromBom = false
  private _allowSoldermaskBridges = false

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintAttr {
    const attr = new FootprintAttr()
    for (const primitive of primitiveSexprs) {
      if (typeof primitive !== "string") {
        throw new Error(
          `attr encountered unsupported child: ${JSON.stringify(primitive)}`,
        )
      }
      if (FLAG_TOKENS.has(primitive)) {
        attr.applyFlag(primitive)
        continue
      }
      if (attr._type === undefined) {
        attr._type = primitive
        continue
      }
      throw new Error(
        `attr encountered duplicate or unknown token "${primitive}"`,
      )
    }
    return attr
  }

  private applyFlag(flag: string) {
    switch (flag) {
      case "board_only":
        this._boardOnly = true
        break
      case "exclude_from_pos_files":
        this._excludeFromPosFiles = true
        break
      case "exclude_from_bom":
        this._excludeFromBom = true
        break
      case "allow_soldermask_bridges":
        this._allowSoldermaskBridges = true
        break
    }
  }

  get type(): string | undefined {
    return this._type
  }

  set type(value: string | undefined) {
    this._type = value
  }

  get boardOnly(): boolean {
    return this._boardOnly
  }

  set boardOnly(value: boolean) {
    this._boardOnly = value
  }

  get excludeFromPosFiles(): boolean {
    return this._excludeFromPosFiles
  }

  set excludeFromPosFiles(value: boolean) {
    this._excludeFromPosFiles = value
  }

  get excludeFromBom(): boolean {
    return this._excludeFromBom
  }

  set excludeFromBom(value: boolean) {
    this._excludeFromBom = value
  }

  get allowSoldermaskBridges(): boolean {
    return this._allowSoldermaskBridges
  }

  set allowSoldermaskBridges(value: boolean) {
    this._allowSoldermaskBridges = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const tokens = ["attr"]
    if (this._type) tokens.push(this._type)
    if (this._boardOnly) tokens.push("board_only")
    if (this._excludeFromPosFiles) tokens.push("exclude_from_pos_files")
    if (this._excludeFromBom) tokens.push("exclude_from_bom")
    if (this._allowSoldermaskBridges) tokens.push("allow_soldermask_bridges")
    return `(${tokens.join(" ")})`
  }
}
SxClass.register(FootprintAttr)
