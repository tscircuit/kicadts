import {
  parseToPrimitiveSExpr,
  type PrimitiveSExpr,
} from "../parseToPrimitiveSExpr"

const DEFAULT_PARENT_TOKEN = "__default__"

export abstract class SxClass {
  abstract token: string
  static token: string

  /**
   * Token strings are sometimes re-used (e.g. a "type" token) but the class
   * varies based on the parent token
   */
  static parentToken?: string

  isSxClass = true

  getChildren(): SxClass[] {
    // By default, return any properties found in this instance that have the _sx* prefix
    return Object.keys(this)
      .filter((k) => k.startsWith("_sx"))
      .map((k) => (this as any)[k])
      .filter((v) => v && typeof v === "object" && v.isSxClass)
  }

  getStringIndented(): string {
    return this.getString()
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n")
  }

  getString(): string {
    const children = this.getChildren()
    if (children.length === 0) {
      return `(${this.token})`
    }

    const lines = [`(${this.token}`]
    for (const p of children) {
      lines.push(p.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
  get [Symbol.toStringTag](): string {
    return this.getString()
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.getString()
  }

  // =========================== STATIC METHODS ===========================

  static classes: Record<string, Record<string, any>> = {}

  /**
   * Should be called after class definition to register the class for parsing
   */
  static register(newClass: any) {
    if (!newClass.token) {
      throw new Error("Class must have a static override token")
    }
    const parentKey = newClass.parentToken ?? DEFAULT_PARENT_TOKEN
    const existing = SxClass.classes[newClass.token] ?? {}
    existing[parentKey] = newClass
    SxClass.classes[newClass.token] = existing
  }

  /**
   * Parse an S-expression string into registered SxClass instances
   */
  static parse(sexpr: string): SxClass[] {
    const primitiveSexpr = parseToPrimitiveSExpr(sexpr)

    return SxClass.parsePrimitiveSexpr(primitiveSexpr) as any
  }

  static fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): SxClass {
    throw new Error(
      `"${this.name}" class has not implemented fromSexprPrimitives`,
    )
  }

  static parsePrimitiveSexpr(
    primitiveSexpr: PrimitiveSExpr,
    options: { parentToken?: string } = {},
  ): SxClass | SxClass[] | number | string | boolean | null {
    const parentToken = options.parentToken

    if (
      Array.isArray(primitiveSexpr) &&
      primitiveSexpr.length > 1 &&
      typeof primitiveSexpr[0] === "string"
    ) {
      const classToken = primitiveSexpr[0] as string
      const classGroup = SxClass.classes[classToken]
      if (!classGroup) {
        throw new Error(
          `Class "${classToken}" not registered via SxClass.register`,
        )
      }
      const parentKey = parentToken ?? DEFAULT_PARENT_TOKEN
      const ClassDef: any =
        classGroup[parentKey] ?? classGroup[DEFAULT_PARENT_TOKEN]
      if (!ClassDef) {
        throw new Error(
          `Class "${classToken}" not registered for parent "${parentToken ?? "<root>"}"`,
        )
      }
      const args = primitiveSexpr.slice(1) as PrimitiveSExpr[]
      if (!("fromSexprPrimitives" in ClassDef)) {
        throw new Error(
          `Class "${classToken}" does not have a fromSexprPrimitives method`,
        )
      }
      const classInstance = ClassDef.fromSexprPrimitives(args)
      return classInstance
    }

    if (Array.isArray(primitiveSexpr)) {
      return primitiveSexpr.map((item) =>
        SxClass.parsePrimitiveSexpr(item, options),
      ) as any[]
    }

    if (
      typeof primitiveSexpr === "number" ||
      typeof primitiveSexpr === "string" ||
      typeof primitiveSexpr === "boolean" ||
      primitiveSexpr === null
    ) {
      return primitiveSexpr as number | string | boolean | null
    }

    throw new Error(
      `Couldn't parse primitive S-expression: ${JSON.stringify(primitiveSexpr)}`,
    )
  }

  // =========================== STATIC UTILITIES  ===========================
  static parsePrimitivesToClassProperties(
    primitiveSexprs: PrimitiveSExpr[],
    parentToken?: string,
  ): {
    propertyMap: Record<string, SxClass>
    arrayPropertyMap: Record<string, SxClass[]>
  } {
    const propertyMap = {} as Record<string, SxClass>
    const arrayPropertyMap = {} as Record<string, SxClass[]>
    for (const primitiveSexpr of primitiveSexprs) {
      const sxClass = SxClass.parsePrimitiveSexpr(primitiveSexpr, {
        parentToken,
      }) as SxClass
      if (!sxClass.isSxClass) continue
      propertyMap[sxClass.token] = sxClass
      arrayPropertyMap[sxClass.token] ??= []
      arrayPropertyMap[sxClass.token]!.push(sxClass)
    }
    return { propertyMap, arrayPropertyMap }
  }
}
