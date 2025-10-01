import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { SheetInstancesRootPath } from "./SheetInstancesRoot"

const SUPPORTED_CHILD_TOKENS = new Set(["project", "path"])

const parseSheetInstancesChildren = (
  primitiveSexprs: PrimitiveSExpr[],
): {
  projects: SheetInstancesProject[]
  paths: SheetInstancesRootPath[]
} => {
  const { propertyMap, arrayPropertyMap } =
    SxClass.parsePrimitivesToClassProperties(primitiveSexprs, "sheet_instances")

  const unsupportedSingularTokens = Object.keys(propertyMap).filter(
    (token) => !SUPPORTED_CHILD_TOKENS.has(token),
  )
  if (unsupportedSingularTokens.length > 0) {
    throw new Error(
      `sheet_instances encountered unsupported child token${unsupportedSingularTokens.length > 1 ? "s" : ""} ${unsupportedSingularTokens
        .map((token) => `"${token}"`)
        .join(", ")}`,
    )
  }

  const unsupportedArrayTokens = Object.keys(arrayPropertyMap).filter(
    (token) => !SUPPORTED_CHILD_TOKENS.has(token),
  )
  if (unsupportedArrayTokens.length > 0) {
    throw new Error(
      `sheet_instances encountered unsupported repeated child token${unsupportedArrayTokens.length > 1 ? "s" : ""} ${unsupportedArrayTokens
        .map((token) => `"${token}"`)
        .join(", ")}`,
    )
  }

  const projects = (arrayPropertyMap.project as SheetInstancesProject[]) ?? []
  if (!projects.length && propertyMap.project) {
    projects.push(propertyMap.project as SheetInstancesProject)
  }

  const paths = (arrayPropertyMap.path as SheetInstancesRootPath[]) ?? []
  if (!paths.length && propertyMap.path) {
    paths.push(propertyMap.path as SheetInstancesRootPath)
  }

  return { projects, paths }
}

export class SheetInstances extends SxClass {
  static override token = "sheet_instances"
  static override parentToken = "kicad_sch"
  token = "sheet_instances"

  private _projects: SheetInstancesProject[] = []
  private _paths: SheetInstancesRootPath[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstances {
    const instances = new SheetInstances()
    const { projects, paths } = parseSheetInstancesChildren(primitiveSexprs)
    instances.projects = projects
    instances.paths = paths
    return instances
  }

  get projects(): SheetInstancesProject[] {
    return [...this._projects]
  }

  set projects(value: SheetInstancesProject[]) {
    this._projects = [...value]
  }

  get paths(): SheetInstancesRootPath[] {
    return [...this._paths]
  }

  set paths(value: SheetInstancesRootPath[]) {
    this._paths = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._projects, ...this._paths]
  }

  override getString(): string {
    const children = this.getChildren()
    if (children.length === 0) {
      return `(${this.token})`
    }

    const lines = [`(${this.token}`]
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SheetInstances)

export class SheetInstancesForSheet extends SheetInstances {
  static override token = "instances"
  static override parentToken = "sheet"
  override token = "instances"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetInstancesForSheet {
    const instances = new SheetInstancesForSheet()
    const { projects, paths } = parseSheetInstancesChildren(primitiveSexprs)
    instances.projects = projects
    instances.paths = paths
    return instances
  }
}
SxClass.register(SheetInstancesForSheet)

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
