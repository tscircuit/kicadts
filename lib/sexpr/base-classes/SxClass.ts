export abstract class SxClass {
  abstract token: string
  static token: string

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

  // =========================== STATIC METHODS ===========================

  static classes: Record<string, SxClass> = {}

  /**
   * Should be called after class definition to register the class for parsing
   */
  static register(newClass: any) {
    if (!newClass.token) {
      throw new Error("Class must have a static override token")
    }
    SxClass.classes[newClass.token] = newClass
  }

  /**
   * Parse an S-expression string into registered SxClass instances
   */
  static parse(sexpr: string): SxClass {
    console.log(SxClass.classes)
  }
}
