import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import type { At } from "./At"
import type { Xy } from "./Xy"
import { Uuid } from "./Uuid"

export type ImageClassProperty = SxClass | PrimitiveSExpr

export class Image extends SxClass {
  static override token = "image"
  token = "image"

  override _propertyMap?: Record<string, SxClass>
  extraArgs: PrimitiveSExpr[] = []

  constructor(args: Array<SxClass | PrimitiveSExpr>) {
    super()

    const classArgs: SxClass[] = []
    for (const arg of args) {
      if (arg instanceof SxClass) {
        classArgs.push(arg)
        continue
      }
      this.extraArgs.push(arg)
    }

    if (classArgs.length > 0) {
      this.loadProperties(classArgs)
    }
  }

  get position(): At | Xy | undefined {
    return (
      (this.getProperty("at") as At | undefined) ??
      (this.getProperty("xy") as Xy | undefined)
    )
  }

  set position(value: At | Xy | undefined) {
    if (!value) {
      if (this._propertyMap) {
        delete this._propertyMap["at"]
        delete this._propertyMap["xy"]
      }
      return
    }
    if (!this._propertyMap) {
      this._propertyMap = {}
    }
    delete this._propertyMap["at"]
    delete this._propertyMap["xy"]
    this.setProperty(value.token, value)
  }

  get scale(): ImageScale | undefined {
    return this.getProperty("scale") as ImageScale | undefined
  }

  set scale(value: ImageScale | number | undefined) {
    if (value === undefined) {
      if (this._propertyMap) delete this._propertyMap["scale"]
      return
    }
    const scaleClass =
      value instanceof ImageScale ? value : new ImageScale([value])
    this.setProperty("scale", scaleClass)
  }

  get layer(): ImageLayer | undefined {
    return this.getProperty("layer") as ImageLayer | undefined
  }

  set layer(value: ImageLayer | string[] | string | undefined) {
    if (value === undefined) {
      if (this._propertyMap) delete this._propertyMap["layer"]
      return
    }
    const layerClass =
      value instanceof ImageLayer
        ? value
        : new ImageLayer(Array.isArray(value) ? value : [value])
    this.setProperty("layer", layerClass)
  }

  get uuid(): Uuid | undefined {
    return this.getProperty("uuid") as Uuid | undefined
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      if (this._propertyMap) delete this._propertyMap["uuid"]
      return
    }
    const uuidClass = value instanceof Uuid ? value : new Uuid([value])
    this.setProperty("uuid", uuidClass)
  }

  get data(): ImageData | undefined {
    return this.getProperty("data") as ImageData | undefined
  }

  set data(value: ImageData | string | string[] | undefined) {
    if (value === undefined) {
      if (this._propertyMap) delete this._propertyMap["data"]
      return
    }
    const dataClass =
      value instanceof ImageData
        ? value
        : new ImageData(Array.isArray(value) ? value : [value])
    this.setProperty("data", dataClass)
  }

  override getString(): string {
    const lines = ["(image"]

    const pushProp = (prop?: SxClass) => {
      if (!prop) return
      const propLines = prop.getString().split("\n")
      for (const propLine of propLines) {
        lines.push(`  ${propLine}`)
      }
    }

    const seen = new Set<string>()
    const preferOrder = ["at", "xy", "scale", "layer", "uuid", "data"]
    for (const token of preferOrder) {
      const prop = this._propertyMap?.[token]
      if (prop) {
        pushProp(prop)
        seen.add(token)
      }
    }

    if (this._propertyMap) {
      for (const [token, prop] of Object.entries(this._propertyMap)) {
        if (seen.has(token)) continue
        pushProp(prop)
      }
    }

    for (const arg of this.extraArgs) {
      lines.push(`  ${printSExpr(arg)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Image)

export class ImageScale extends SxClass {
  static override token = "scale"
  static override parentToken = "image"
  token = "scale"

  value: number

  constructor(args: [value: number]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(scale ${this.value})`
  }
}
SxClass.register(ImageScale)

export class ImageLayer extends SxClass {
  static override token = "layer"
  static override parentToken = "image"
  static override rawArgs = true
  token = "layer"

  layers: string[]

  constructor(args: string[]) {
    super()
    this.layers = args.map(String)
  }

  override getString(): string {
    return `(layer ${this.layers.join(" ")})`
  }
}
SxClass.register(ImageLayer)

export class ImageData extends SxClass {
  static override token = "data"
  static override parentToken = "image"
  static override rawArgs = true
  token = "data"

  chunks: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.chunks = args
  }

  get value(): string {
    return this.chunks
      .map((chunk) =>
        typeof chunk === "string" || typeof chunk === "number"
          ? String(chunk)
          : printSExpr(chunk),
      )
      .join("")
  }

  set value(data: string) {
    this.chunks = [data]
  }

  override getString(): string {
    if (this.chunks.length === 0) {
      return "(data)"
    }
    const chunkStrings = this.chunks.map((chunk) => printSExpr(chunk))
    return `(data ${chunkStrings.join(" ")})`
  }
}
SxClass.register(ImageData)
