import {
  parseToPrimitiveSExpr,
  type PrimitiveSExpr,
} from "../parseToPrimitiveSExpr"

const DEFAULT_PARENT_TOKEN = "__default__"

export abstract class SxClass {
  abstract token: string
  static token: string

  /**
   * Set to true for classes that need access to the raw (unparsed) argument list
   */
  static rawArgs = false

  /**
   * Token strings are sometimes re-used (e.g. a "type" token) but the class
   * varies based on the parent token
   */
  static parentToken?: string

  /**
   * Some classes accept properties in any order, in these cases we generally
   * store the properties in a map by token. You can load a properties array
   * using `loadProperties`
   */
  _propertyMap?: Record<string, SxClass>

  getProperty<T extends SxClass>(token: string): T | undefined {
    return this._propertyMap?.[token] as T
  }

  setProperty(token: string, property: SxClass) {
    this._propertyMap ??= {}
    this._propertyMap[token] = property
  }

  loadProperties(properties: Array<SxClass>) {
    this._propertyMap = properties.reduce(
      (acc, p) => {
        acc[p.token] = p
        return acc
      },
      {} as Record<string, SxClass>,
    )
  }

  getString(): string {
    if (this._propertyMap) {
      const lines = [`(${this.token}`]
      for (const p of Object.values(this._propertyMap)) {
        const pLines = p.getString().split("\n")
        for (const pLine of pLines) {
          lines.push(`  ${pLine}`)
        }
      }
      lines.push(")")
      return lines.join("\n")
    }

    throw new Error(
      `Cannot stringify ${this.constructor.name} without defining a propertyMap, consider manually defining the getString() method`,
    )
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
      const paramArray = ClassDef.rawArgs
        ? args
        : SxClass.parsePrimitiveSexpr(args, { parentToken: classToken })
      const classInstance = new ClassDef(paramArray)
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
}
