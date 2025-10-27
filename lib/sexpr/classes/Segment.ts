import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { SegmentEnd } from "./SegmentEnd"
import { SegmentLocked } from "./SegmentLocked"
import { SegmentNet } from "./SegmentNet"
import { SegmentStart } from "./SegmentStart"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"

const SUPPORTED_SINGLE_TOKENS = new Set([
  "start",
  "end",
  "width",
  "layer",
  "net",
  "tstamp",
  "uuid",
  "locked",
])

export interface SegmentConstructorParams {
  start?: SegmentStart | { x: number; y: number }
  end?: SegmentEnd | { x: number; y: number }
  width?: Width | number
  layer?: Layer | string | Array<string | number>
  net?: SegmentNet | { id: number; name?: string }
  tstamp?: Tstamp | string
  uuid?: Uuid | string
  locked?: boolean
}

export class Segment extends SxClass {
  static override token = "segment"
  override token = "segment"

  private _sxStart?: SegmentStart
  private _sxEnd?: SegmentEnd
  private _sxWidth?: Width
  private _sxLayer?: Layer
  private _sxNet?: SegmentNet
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid
  private _sxLocked?: SegmentLocked

  constructor(params: SegmentConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.end !== undefined) this.end = params.end
    if (params.width !== undefined) this.width = params.width
    if (params.layer !== undefined) this.layer = params.layer
    if (params.net !== undefined) this.net = params.net
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Segment {
    const segment = new Segment()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    const unexpectedSingleTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_SINGLE_TOKENS.has(token),
    )
    if (unexpectedSingleTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside segment expression: ${unexpectedSingleTokens.join(", ")}`,
      )
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(
          `Unsupported child tokens inside segment expression: ${token}`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `Segment does not support repeated child tokens: ${token}`,
        )
      }
    }

    segment._sxStart =
      (arrayPropertyMap.start?.[0] as SegmentStart | undefined) ??
      (propertyMap.start as SegmentStart | undefined)
    segment._sxEnd =
      (arrayPropertyMap.end?.[0] as SegmentEnd | undefined) ??
      (propertyMap.end as SegmentEnd | undefined)
    segment._sxWidth =
      (arrayPropertyMap.width?.[0] as Width | undefined) ??
      (propertyMap.width as Width | undefined)
    segment._sxLayer =
      (arrayPropertyMap.layer?.[0] as Layer | undefined) ??
      (propertyMap.layer as Layer | undefined)
    segment._sxNet =
      (arrayPropertyMap.net?.[0] as SegmentNet | undefined) ??
      (propertyMap.net as SegmentNet | undefined)
    const locked =
      (arrayPropertyMap.locked?.[0] as SegmentLocked | undefined) ??
      (propertyMap.locked as SegmentLocked | undefined)
    segment._sxLocked = locked && locked.value ? locked : undefined
    segment._sxTstamp =
      (arrayPropertyMap.tstamp?.[0] as Tstamp | undefined) ??
      (propertyMap.tstamp as Tstamp | undefined)
    segment._sxUuid =
      (arrayPropertyMap.uuid?.[0] as Uuid | undefined) ??
      (propertyMap.uuid as Uuid | undefined)

    return segment
  }

  get start(): SegmentStart | undefined {
    return this._sxStart
  }

  set start(value: SegmentStart | { x: number; y: number } | undefined) {
    this._sxStart = this.normalizeStart(value)
  }

  get end(): SegmentEnd | undefined {
    return this._sxEnd
  }

  set end(value: SegmentEnd | { x: number; y: number } | undefined) {
    this._sxEnd = this.normalizeEnd(value)
  }

  get startPoint(): { x: number; y: number } | undefined {
    return this._sxStart?.toObject()
  }

  get endPoint(): { x: number; y: number } | undefined {
    return this._sxEnd?.toObject()
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  set width(value: Width | number | undefined) {
    if (value === undefined) {
      this._sxWidth = undefined
      return
    }
    this._sxWidth = value instanceof Width ? value : new Width(value)
  }

  get widthClass(): Width | undefined {
    return this._sxWidth
  }

  set widthClass(value: Width | undefined) {
    this._sxWidth = value
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | string | Array<string | number> | undefined) {
    if (value === undefined) {
      this._sxLayer = undefined
      return
    }
    if (value instanceof Layer) {
      this._sxLayer = value
      return
    }
    const names = Array.isArray(value) ? value : [value]
    this._sxLayer = new Layer(names)
  }

  get net(): SegmentNet | undefined {
    return this._sxNet
  }

  set net(value: SegmentNet | { id: number; name?: string } | undefined) {
    if (value === undefined) {
      this._sxNet = undefined
      return
    }
    if (value instanceof SegmentNet) {
      this._sxNet = value
      return
    }
    this._sxNet = new SegmentNet(value.id, value.name)
  }

  get tstamp(): Tstamp | undefined {
    return this._sxTstamp
  }

  set tstamp(value: Tstamp | string | undefined) {
    if (value === undefined) {
      this._sxTstamp = undefined
      return
    }
    this._sxTstamp = value instanceof Tstamp ? value : new Tstamp(value)
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

  get locked(): boolean {
    return this._sxLocked?.value ?? false
  }

  set locked(value: boolean) {
    this._sxLocked = value ? new SegmentLocked(true) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxNet) children.push(this._sxNet)
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  private normalizeStart(
    value: SegmentStart | { x: number; y: number } | undefined,
  ): SegmentStart | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof SegmentStart) {
      return value
    }
    return new SegmentStart(value.x, value.y)
  }

  private normalizeEnd(
    value: SegmentEnd | { x: number; y: number } | undefined,
  ): SegmentEnd | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof SegmentEnd) {
      return value
    }
    return new SegmentEnd(value.x, value.y)
  }
}
SxClass.register(Segment)
