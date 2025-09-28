import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"
import { At } from "./At"
import { Xy } from "./Xy"

type ImageUnknownKind = ImageUnknown

export class Image extends SxClass {
  static override token = "image"
  token = "image"

  private _sxPosition?: At | Xy
  private _sxScale?: ImageScale
  private _sxLayer?: Layer
  private _sxUuid?: Uuid
  private _sxData?: ImageData
  private _additionalChildren: SxClass[] = []
  private _unknownChildren: ImageUnknownKind[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Image {
    const image = new Image()

    for (const primitive of primitiveSexprs) {
      if (Array.isArray(primitive) && primitive.length > 0) {
        try {
          const parsed = SxClass.parsePrimitiveSexpr(primitive, {
            parentToken: this.token,
          })
          if (parsed instanceof SxClass) {
            image.attachChild(parsed)
            continue
          }
        } catch (error) {
          // handled below as unknown
        }
      }

      image.addUnknown(primitive)
    }

    return image
  }

  private attachChild(child: SxClass) {
    if (child instanceof At || child instanceof Xy) {
      this._sxPosition = child
      return
    }
    if (child instanceof ImageScale) {
      this._sxScale = child
      return
    }
    if (child instanceof Layer) {
      this._sxLayer = child
      return
    }
    if (child instanceof Uuid) {
      this._sxUuid = child
      return
    }
    if (child instanceof ImageData) {
      this._sxData = child
      return
    }

    this._additionalChildren.push(child)
  }

  private addUnknown(primitive: PrimitiveSExpr) {
    this._unknownChildren.push(new ImageUnknown(primitive))
  }

  get position(): At | Xy | undefined {
    return this._sxPosition
  }

  set position(value: At | Xy | undefined) {
    this._sxPosition = value
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

  get additionalChildren(): SxClass[] {
    return [...this._additionalChildren]
  }

  set additionalChildren(children: SxClass[]) {
    this._additionalChildren = [...children]
  }

  get unknownChildren(): ImageUnknownKind[] {
    return [...this._unknownChildren]
  }

  set unknownChildren(children: ImageUnknownKind[]) {
    this._unknownChildren = [...children]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPosition) children.push(this._sxPosition)
    if (this._sxScale) children.push(this._sxScale)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxData) children.push(this._sxData)
    children.push(...this._additionalChildren)
    children.push(...this._unknownChildren)
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
    const numeric =
      typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : 1
    return new ImageScale(Number.isFinite(numeric) ? numeric : 1)
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

  private _chunks: PrimitiveSExpr[]

  constructor(chunks: PrimitiveSExpr[] = []) {
    super()
    this._chunks = chunks
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ImageData {
    return new ImageData(primitiveSexprs)
  }

  static fromStrings(values: string[]): ImageData {
    return new ImageData(values)
  }

  get chunks(): PrimitiveSExpr[] {
    return [...this._chunks]
  }

  set chunks(values: PrimitiveSExpr[]) {
    this._chunks = [...values]
  }

  get value(): string {
    return this._chunks.map((chunk) => printSExpr(chunk)).join("")
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
    const rendered = this._chunks.map((chunk) => printSExpr(chunk)).join(" ")
    return `(data ${rendered})`
  }
}
SxClass.register(ImageData)

class ImageUnknown extends SxClass {
  static override token = "__image_unknown__"
  token: string
  private readonly primitive: PrimitiveSExpr

  constructor(primitive: PrimitiveSExpr) {
    super()
    this.primitive = primitive
    this.token = this.resolveToken(primitive)
  }

  private resolveToken(primitive: PrimitiveSExpr): string {
    if (typeof primitive === "string") return primitive
    if (Array.isArray(primitive) && primitive.length > 0) {
      const [token] = primitive
      if (typeof token === "string") return token
    }
    return "__image_unknown__"
  }

  get primitiveValue(): PrimitiveSExpr {
    return this.primitive
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return printSExpr(this.primitive)
  }
}
