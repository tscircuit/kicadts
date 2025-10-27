import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At, type AtInput } from "./At"
import { Layers } from "./Layers"
import { Uuid } from "./Uuid"
import { Tstamp } from "./Tstamp"
import { ViaNet } from "./ViaNet"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { PadTeardrops } from "./PadTeardrops"

const BARE_FLAGS = new Set([
  "locked",
  "free",
  "remove_unused_layers",
  "keep_end_layers",
])

export interface ViaConstructorParams {
  type?: string
  locked?: boolean
  free?: boolean
  removeUnusedLayers?: boolean
  keepEndLayers?: boolean
  at?: AtInput
  size?: number
  drill?: number
  layers?: Layers | string[]
  net?: ViaNet
  uuid?: Uuid | string
  tstamp?: Tstamp | string
  teardrops?: PadTeardrops
}

export class Via extends SxClass {
  static override token = "via"
  token = "via"

  private _type?: string
  private _locked = false
  private _free = false
  private _removeUnusedLayers = false
  private _keepEndLayers = false
  private _sxAt?: At
  private _size?: number
  private _drill?: number
  private _sxLayers?: Layers
  private _sxNet?: ViaNet
  private _sxUuid?: Uuid
  private _sxTstamp?: Tstamp
  private _sxTeardrops?: PadTeardrops

  constructor(params: ViaConstructorParams = {}) {
    super()
    if (params.type !== undefined) this.type = params.type
    if (params.locked !== undefined) this.locked = params.locked
    if (params.free !== undefined) this.free = params.free
    if (params.removeUnusedLayers !== undefined)
      this.removeUnusedLayers = params.removeUnusedLayers
    if (params.keepEndLayers !== undefined)
      this.keepEndLayers = params.keepEndLayers
    if (params.at !== undefined) this.at = params.at
    if (params.size !== undefined) this.size = params.size
    if (params.drill !== undefined) this.drill = params.drill
    if (params.layers !== undefined) this.layers = params.layers
    if (params.net !== undefined) this.net = params.net
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.teardrops !== undefined) this.teardrops = params.teardrops
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Via {
    const via = new Via()

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        via.consumeBareToken(primitive)
        continue
      }

      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `via encountered unsupported primitive child: ${JSON.stringify(primitive)}`,
        )
      }

      const [token, ...rest] = primitive
      if (typeof token !== "string") {
        throw new Error(
          `via encountered child with non-string token: ${JSON.stringify(primitive)}`,
        )
      }

      via.consumeNode(token, rest as PrimitiveSExpr[])
    }

    return via
  }

  private consumeBareToken(token: string) {
    if (token === "blind" || token === "micro") {
      this._type = token
      return
    }
    if (!BARE_FLAGS.has(token)) {
      throw new Error(`via encountered unsupported flag "${token}"`)
    }
    switch (token) {
      case "locked":
        this._locked = true
        break
      case "free":
        this._free = true
        break
      case "remove_unused_layers":
        this._removeUnusedLayers = true
        break
      case "keep_end_layers":
        this._keepEndLayers = true
        break
    }
  }

  private consumeNode(token: string, args: PrimitiveSExpr[]) {
    switch (token) {
      case "type": {
        const value = toStringValue(args[0])
        if (value === undefined) {
          throw new Error("via type expects a string value")
        }
        this._type = value
        return
      }
      case "locked":
        this._locked = this.parseYesNo(args)
        return
      case "free":
        this._free = this.parseYesNo(args)
        return
      case "remove_unused_layers":
        this._removeUnusedLayers = this.parseYesNo(args)
        return
      case "keep_end_layers":
        this._keepEndLayers = this.parseYesNo(args)
        return
      case "at": {
        const parsed = SxClass.parsePrimitiveSexpr(["at", ...args] as any, {
          parentToken: this.token,
        })
        if (!(parsed instanceof At)) {
          throw new Error("via failed to parse at child")
        }
        this._sxAt = parsed
        return
      }
      case "size": {
        const value = toNumberValue(args[0])
        if (value === undefined) {
          throw new Error("via size expects a numeric value")
        }
        this._size = value
        return
      }
      case "drill": {
        const value = toNumberValue(args[0])
        if (value === undefined) {
          throw new Error("via drill expects a numeric value")
        }
        this._drill = value
        return
      }
      case "layers": {
        this._sxLayers = Layers.fromSexprPrimitives(args)
        return
      }
      case "net": {
        this._sxNet = ViaNet.fromSexprPrimitives(args)
        return
      }
      case "teardrops": {
        this._sxTeardrops = PadTeardrops.fromSexprPrimitives(args)
        return
      }
      case "uuid": {
        const value = toStringValue(args[0])
        if (value === undefined) {
          throw new Error("via uuid expects a string value")
        }
        this._sxUuid = new Uuid(value)
        return
      }
      case "tstamp": {
        const value = toStringValue(args[0])
        if (value === undefined) {
          throw new Error("via tstamp expects a string value")
        }
        this._sxTstamp = new Tstamp(value)
        return
      }
      default:
        throw new Error(`via encountered unsupported child token "${token}"`)
    }
  }

  private parseYesNo(args: PrimitiveSExpr[]): boolean {
    if (args.length === 0) return true
    const value = toStringValue(args[0])
    if (value === undefined) {
      throw new Error("Expected string when parsing via boolean child")
    }
    return /^(yes|true)$/iu.test(value)
  }

  get type(): string | undefined {
    return this._type
  }

  set type(value: string | undefined) {
    this._type = value
  }

  get locked(): boolean {
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
  }

  get free(): boolean {
    return this._free
  }

  set free(value: boolean) {
    this._free = value
  }

  get removeUnusedLayers(): boolean {
    return this._removeUnusedLayers
  }

  set removeUnusedLayers(value: boolean) {
    this._removeUnusedLayers = value
  }

  get keepEndLayers(): boolean {
    return this._keepEndLayers
  }

  set keepEndLayers(value: boolean) {
    this._keepEndLayers = value
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: AtInput | undefined) {
    this._sxAt = value !== undefined ? At.from(value) : undefined
  }

  get size(): number | undefined {
    return this._size
  }

  set size(value: number | undefined) {
    this._size = value
  }

  get drill(): number | undefined {
    return this._drill
  }

  set drill(value: number | undefined) {
    this._drill = value
  }

  get layers(): Layers | undefined {
    return this._sxLayers
  }

  set layers(value: Layers | string[] | undefined) {
    if (value === undefined) {
      this._sxLayers = undefined
      return
    }
    this._sxLayers = value instanceof Layers ? value : new Layers(value)
  }

  get net(): ViaNet | undefined {
    return this._sxNet
  }

  set net(value: ViaNet | undefined) {
    this._sxNet = value
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

  get teardrops(): PadTeardrops | undefined {
    return this._sxTeardrops
  }

  set teardrops(value: PadTeardrops | undefined) {
    this._sxTeardrops = value
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

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxLayers) children.push(this._sxLayers)
    if (this._sxNet) children.push(this._sxNet)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxTeardrops) children.push(this._sxTeardrops)
    return children
  }

  override getString(): string {
    const lines = ["(via"]

    if (this._type !== undefined) {
      lines.push(`  (type ${this._type})`)
    }
    if (this._locked) lines.push("  locked")
    if (this._free) lines.push("  free")
    if (this._removeUnusedLayers) lines.push("  remove_unused_layers")
    if (this._keepEndLayers) lines.push("  keep_end_layers")
    if (this._sxAt) lines.push(this._sxAt.getStringIndented())
    if (this._size !== undefined) lines.push(`  (size ${this._size})`)
    if (this._drill !== undefined) lines.push(`  (drill ${this._drill})`)
    if (this._sxLayers) lines.push(this._sxLayers.getStringIndented())
    if (this._sxNet) lines.push(this._sxNet.getStringIndented())
    if (this._sxUuid) lines.push(this._sxUuid.getStringIndented())
    if (this._sxTstamp) lines.push(this._sxTstamp.getStringIndented())
    if (this._sxTeardrops) {
      lines.push(this._sxTeardrops.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Via)
