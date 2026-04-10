import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { ArcStart } from "./ArcStart"
import { ArcMid } from "./ArcMid"
import { ArcEnd } from "./ArcEnd"
import { ArcNet } from "./ArcNet"

export interface ArcPoint {
  x: number
  y: number
}

const SUPPORTED_SINGLE_TOKENS = new Set([
  "start",
  "mid",
  "end",
  "width",
  "layer",
  "net",
  "tstamp",
  "uuid",
])

export interface ArcConstructorParams {
  start?: ArcStart | ArcPoint
  mid?: ArcMid | ArcPoint
  end?: ArcEnd | ArcPoint
  width?: Width | number
  layer?: Layer | string | Array<string | number>
  net?: ArcNet | { id: number; name?: string }
  tstamp?: Tstamp | string
  uuid?: Uuid | string
}

export class Arc extends SxClass {
  static override token = "arc"
  static override parentToken = "kicad_pcb"
  override token = "arc"

  private _sxStart?: ArcStart
  private _sxMid?: ArcMid
  private _sxEnd?: ArcEnd
  private _sxWidth?: Width
  private _sxLayer?: Layer
  private _sxNet?: ArcNet
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid

  constructor(params: ArcConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.mid !== undefined) this.mid = params.mid
    if (params.end !== undefined) this.end = params.end
    if (params.width !== undefined) this.width = params.width
    if (params.layer !== undefined) this.layer = params.layer
    if (params.net !== undefined) this.net = params.net
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Arc {
    const arc = new Arc()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(`arc encountered unsupported child token "${token}"`)
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(`arc encountered unsupported child token "${token}"`)
      }
      if (entries.length > 1) {
        throw new Error(`arc does not support repeated child token "${token}"`)
      }
    }

    arc._sxStart = propertyMap.start as ArcStart | undefined
    arc._sxMid = propertyMap.mid as ArcMid | undefined
    arc._sxEnd = propertyMap.end as ArcEnd | undefined
    arc._sxWidth = propertyMap.width as Width | undefined
    arc._sxLayer = propertyMap.layer as Layer | undefined
    arc._sxNet = propertyMap.net as ArcNet | undefined
    arc._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    arc._sxUuid = propertyMap.uuid as Uuid | undefined

    return arc
  }

  get start(): ArcStart | undefined {
    return this._sxStart
  }

  set start(value: ArcStart | ArcPoint | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    this._sxStart =
      value instanceof ArcStart ? value : new ArcStart(value.x, value.y)
  }

  get mid(): ArcMid | undefined {
    return this._sxMid
  }

  set mid(value: ArcMid | ArcPoint | undefined) {
    if (value === undefined) {
      this._sxMid = undefined
      return
    }
    this._sxMid = value instanceof ArcMid ? value : new ArcMid(value.x, value.y)
  }

  get end(): ArcEnd | undefined {
    return this._sxEnd
  }

  set end(value: ArcEnd | ArcPoint | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    this._sxEnd = value instanceof ArcEnd ? value : new ArcEnd(value.x, value.y)
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
    } else {
      const names = Array.isArray(value) ? value : [value]
      this._sxLayer = new Layer(names)
    }
  }

  get net(): ArcNet | undefined {
    return this._sxNet
  }

  set net(value: ArcNet | { id: number; name?: string } | undefined) {
    if (value === undefined) {
      this._sxNet = undefined
      return
    }
    this._sxNet =
      value instanceof ArcNet ? value : new ArcNet(value.id, value.name)
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

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxMid) children.push(this._sxMid)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxNet) children.push(this._sxNet)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const lines = ["(arc"]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Arc)
