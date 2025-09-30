import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"
import { At, type AtInput } from "./At"
import { Xy } from "./Xy"

const SUPPORTED_SINGLE_TOKENS = new Set([
  "at",
  "xy",
  "scale",
  "layer",
  "uuid",
  "data",
])

const SUPPORTED_MULTI_TOKENS = new Set<string>()

export interface ImageConstructorParams {
  position?: AtInput | Xy
  scale?: ImageScale | number
  layer?: Layer | string | string[]
  uuid?: Uuid | string
  data?: ImageData | string | string[]
}

export class Image extends SxClass {
  static override token = "image"
  token = "image"

  private _sxPosition?: At | Xy
  private _sxScale?: ImageScale
  private _sxLayer?: Layer
  private _sxUuid?: Uuid
  private _sxData?: ImageData

  constructor(params: ImageConstructorParams = {}) {
    super()

    if (params.position !== undefined) this.position = params.position
    if (params.scale !== undefined) this.scale = params.scale
    if (params.layer !== undefined) this.layer = params.layer
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.data !== undefined) this.data = params.data
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Image {
    const image = new Image()

    const structuredPrimitives: PrimitiveSExpr[] = []

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `image encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      structuredPrimitives.push(primitive)
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(structuredPrimitives, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(`image encountered unsupported child token "${token}"`)
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(`image encountered unsupported child token "${token}"`)
      }
      if (!SUPPORTED_MULTI_TOKENS.has(token) && entries.length > 1) {
        throw new Error(
          `image does not support repeated child token "${token}"`,
        )
      }
    }

    const atInstance = propertyMap.at as At | undefined
    const xyInstance = propertyMap.xy as Xy | undefined
    if (atInstance && xyInstance) {
      throw new Error("image cannot include both at and xy child tokens")
    }

    image._sxPosition = atInstance ?? xyInstance
    image._sxScale = propertyMap.scale as ImageScale | undefined
    image._sxLayer = propertyMap.layer as Layer | undefined
    image._sxUuid = propertyMap.uuid as Uuid | undefined
    image._sxData = propertyMap.data as ImageData | undefined

    return image
  }

  get position(): At | Xy | undefined {
    return this._sxPosition
  }

  set position(value: AtInput | Xy | undefined) {
    if (value === undefined) {
      this._sxPosition = undefined
      return
    }
    if (value instanceof Xy) {
      this._sxPosition = value
      return
    }
    // Handle AtInput (At, array, or object)
    this._sxPosition = At.from(value as AtInput)
  }

  get scale(): ImageScale | undefined {
    return this._sxScale
  }

  set scale(value: ImageScale | number | undefined) {
    if (value === undefined) {
      this._sxScale = undefined
      return
    }
    this._sxScale = value instanceof ImageScale ? value : new ImageScale(value)
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | string | string[] | undefined) {
    if (value === undefined) {
      this._sxLayer = undefined
      return
    }
    if (value instanceof Layer) {
      this._sxLayer = value
    } else {
      const names = Array.isArray(value) ? value : [value]
      this._sxLayer = new Layer(names)
    }
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  get data(): ImageData | undefined {
    return this._sxData
  }

  set data(value: ImageData | string | string[] | undefined) {
    if (value === undefined) {
      this._sxData = undefined
      return
    }
    if (value instanceof ImageData) {
      this._sxData = value
    } else if (Array.isArray(value)) {
      this._sxData = ImageData.fromStrings(value)
    } else {
      this._sxData = ImageData.fromStrings([value])
    }
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPosition) children.push(this._sxPosition)
    if (this._sxScale) children.push(this._sxScale)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxData) children.push(this._sxData)
    return children
  }
}
SxClass.register(Image)

export class ImageScale extends SxClass {
  static override token = "scale"
  static override parentToken = "image"
  token = "scale"

  value: number

  constructor(value: number) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ImageScale {
    const [raw] = primitiveSexprs
    const numeric = toNumberValue(raw)
    return new ImageScale(numeric ?? 1)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(scale ${this.value})`
  }
}
SxClass.register(ImageScale)

export class ImageData extends SxClass {
  static override token = "data"
  static override parentToken = "image"
  token = "data"

  private _chunks: string[]

  constructor(chunks: string[] = []) {
    super()
    this._chunks = chunks
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ImageData {
    const chunks = primitiveSexprs.map((primitive) =>
      primitiveToChunk(primitive),
    )
    return new ImageData(chunks)
  }

  static fromStrings(values: string[]): ImageData {
    return new ImageData(values)
  }

  get chunks(): string[] {
    return [...this._chunks]
  }

  set chunks(values: string[]) {
    this._chunks = [...values]
  }

  get value(): string {
    return this._chunks.join("")
  }

  set value(data: string) {
    this._chunks = [data]
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._chunks.length === 0) {
      return "(data)"
    }
    const rendered = this._chunks
      .map((chunk) => quoteSExprString(chunk))
      .join(" ")
    return `(data ${rendered})`
  }
}
SxClass.register(ImageData)

function primitiveToChunk(value: PrimitiveSExpr): string {
  const stringValue = toStringValue(value)
  if (stringValue !== undefined) {
    return stringValue
  }
  return printSExpr(value)
}
