import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class SheetInstances extends SxClass {
  static override token = "sheet_instances"
  static override parentToken = "kicad_sch"
  token = "sheet_instances"

  projects: SheetInstancesProject[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstances {
    const instances = new SheetInstances()
    const { arrayPropertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      "sheet_instances",
    )

    instances.projects =
      (arrayPropertyMap.project as SheetInstancesProject[]) ?? []

    return instances
  }

  override getChildren(): SxClass[] {
    return [...this.projects]
  }

  override getString(): string {
    const lines = ["(sheet_instances"]
    for (const project of this.projects) {
      lines.push(project.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SheetInstances)

export class SheetInstancesProject extends SxClass {
  static override token = "project"
  static override parentToken = "sheet_instances"
  token = "project"

  name: string
  paths: SheetInstancePath[] = []

  constructor(name: string) {
    super()
    this.name = name
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstancesProject {
    const [namePrimitive, ...rest] = primitiveSexprs
    const name = toStringValue(namePrimitive)
    if (name === undefined) {
      throw new Error("sheet project instances require a project name")
    }

    const project = new SheetInstancesProject(name)

    const { arrayPropertyMap } = SxClass.parsePrimitivesToClassProperties(
      rest,
      "sheet_project",
    )

    project.paths = (arrayPropertyMap.path as SheetInstancePath[]) ?? []

    return project
  }

  override getChildren(): SxClass[] {
    return [...this.paths]
  }

  override getString(): string {
    const lines = [`(project ${quoteSExprString(this.name)}`]
    for (const path of this.paths) {
      lines.push(path.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SheetInstancesProject)

export class SheetInstancePath extends SxClass {
  static override token = "path"
  static override parentToken = "sheet_project"
  token = "path"

  value: string
  pages: SheetInstancePage[] = []

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstancePath {
    const [pathPrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(pathPrimitive)
    if (value === undefined) {
      throw new Error("sheet instance path value must be a string")
    }

    const path = new SheetInstancePath(value)

    const { arrayPropertyMap } = SxClass.parsePrimitivesToClassProperties(
      rest,
      "sheet_path",
    )

    path.pages = (arrayPropertyMap.page as SheetInstancePage[]) ?? []

    return path
  }

  override getChildren(): SxClass[] {
    return [...this.pages]
  }

  override getString(): string {
    const lines = [`(path ${quoteSExprString(this.value)}`]
    for (const page of this.pages) {
      lines.push(page.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SheetInstancePath)

export class SheetInstancePage extends SxClass {
  static override token = "page"
  static override parentToken = "sheet_path"
  token = "page"

  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstancePage {
    const [valuePrimitive] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("sheet instance page value must be a string")
    }
    return new SheetInstancePage(value)
  }

  override getString(): string {
    return `(page ${quoteSExprString(this.value)})`
  }
}
SxClass.register(SheetInstancePage)
