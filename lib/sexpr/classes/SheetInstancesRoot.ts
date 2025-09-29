import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

const SUPPORTED_ARRAY_TOKENS = new Set(["page"])

export class SheetInstancesRoot extends SxClass {
  static override token = "sheet_instances"
  override token = "sheet_instances"

  private _paths: SheetInstancesRootPath[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstancesRoot {
    const sheetInstances = new SheetInstancesRoot()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    const unsupportedSingularTokens = Object.keys(propertyMap).filter(
      (token) => token !== "path",
    )
    if (unsupportedSingularTokens.length > 0) {
      throw new Error(
        `Unsupported singular child tokens inside sheet_instances expression: ${unsupportedSingularTokens.join(", ")}`,
      )
    }

    const unsupportedArrayTokens = Object.keys(arrayPropertyMap).filter(
      (token) => token !== "path",
    )
    if (unsupportedArrayTokens.length > 0) {
      throw new Error(
        `Unsupported repeated child tokens inside sheet_instances expression: ${unsupportedArrayTokens.join(", ")}`,
      )
    }

    const paths = (arrayPropertyMap.path as SheetInstancesRootPath[]) ?? []
    if (!paths.length && propertyMap.path) {
      paths.push(propertyMap.path as SheetInstancesRootPath)
    }
    sheetInstances._paths = paths

    return sheetInstances
  }

  get paths(): SheetInstancesRootPath[] {
    return [...this._paths]
  }

  set paths(value: SheetInstancesRootPath[]) {
    this._paths = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._paths]
  }
}
SxClass.register(SheetInstancesRoot)

export class SheetInstancesRootPath extends SxClass {
  static override token = "path"
  static override parentToken = "sheet_instances"
  override token = "path"

  private _value = ""
  private _pages: SheetInstancesRootPage[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstancesRootPath {
    const [valuePrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("sheet_instances path requires a string identifier")
    }

    const path = new SheetInstancesRootPath()
    path._value = value

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, "sheet_instances_path")

    const unsupportedSingularTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_ARRAY_TOKENS.has(token),
    )
    if (unsupportedSingularTokens.length > 0) {
      throw new Error(
        `Unsupported singular child tokens inside sheet_instances path expression: ${unsupportedSingularTokens.join(", ")}`,
      )
    }

    const unsupportedArrayTokens = Object.keys(arrayPropertyMap).filter(
      (token) => !SUPPORTED_ARRAY_TOKENS.has(token),
    )
    if (unsupportedArrayTokens.length > 0) {
      throw new Error(
        `Unsupported repeated child tokens inside sheet_instances path expression: ${unsupportedArrayTokens.join(", ")}`,
      )
    }

    const pages = (arrayPropertyMap.page as SheetInstancesRootPage[]) ?? []
    if (!pages.length && propertyMap.page) {
      pages.push(propertyMap.page as SheetInstancesRootPage)
    }
    path._pages = pages

    return path
  }

  get value(): string {
    return this._value
  }

  set value(newValue: string) {
    this._value = newValue
  }

  get pages(): SheetInstancesRootPage[] {
    return [...this._pages]
  }

  set pages(value: SheetInstancesRootPage[]) {
    this._pages = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._pages]
  }

  override getString(): string {
    const lines = [`(path ${quoteSExprString(this._value)}`]
    for (const page of this._pages) {
      lines.push(page.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SheetInstancesRootPath)

export class SheetInstancesRootPage extends SxPrimitiveString {
  static override token = "page"
  static override parentToken = "sheet_instances_path"
  override token = "page"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstancesRootPage {
    const [valuePrimitive] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("sheet_instances page expects a string value")
    }
    return new SheetInstancesRootPage(value)
  }

  override getString(): string {
    return `(page ${quoteSExprString(this.value)})`
  }
}
SxClass.register(SheetInstancesRootPage)
