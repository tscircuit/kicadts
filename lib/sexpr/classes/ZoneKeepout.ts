import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { ZoneKeepoutCopperpour } from "./ZoneKeepoutCopperpour"
import { ZoneKeepoutFootprints } from "./ZoneKeepoutFootprints"
import { ZoneKeepoutPads } from "./ZoneKeepoutPads"
import { ZoneKeepoutTracks } from "./ZoneKeepoutTracks"
import { ZoneKeepoutVias } from "./ZoneKeepoutVias"

const SINGLE_TOKENS = new Set([
  "tracks",
  "vias",
  "pads",
  "copperpour",
  "footprints",
])

export type ZoneKeepoutRule = "allowed" | "not_allowed"

export interface ZoneKeepoutConstructorParams {
  tracks?: ZoneKeepoutTracks | ZoneKeepoutRule
  vias?: ZoneKeepoutVias | ZoneKeepoutRule
  pads?: ZoneKeepoutPads | ZoneKeepoutRule
  copperpour?: ZoneKeepoutCopperpour | ZoneKeepoutRule
  footprints?: ZoneKeepoutFootprints | ZoneKeepoutRule
}

export class ZoneKeepout extends SxClass {
  static override token = "keepout"
  static override parentToken = "zone"
  override token = "keepout"

  private _sxTracks?: ZoneKeepoutTracks
  private _sxVias?: ZoneKeepoutVias
  private _sxPads?: ZoneKeepoutPads
  private _sxCopperpour?: ZoneKeepoutCopperpour
  private _sxFootprints?: ZoneKeepoutFootprints

  constructor(params: ZoneKeepoutConstructorParams = {}) {
    super()
    if (params.tracks !== undefined) this.tracks = params.tracks
    if (params.vias !== undefined) this.vias = params.vias
    if (params.pads !== undefined) this.pads = params.pads
    if (params.copperpour !== undefined) this.copperpour = params.copperpour
    if (params.footprints !== undefined) this.footprints = params.footprints
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneKeepout {
    const keepout = new ZoneKeepout()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SINGLE_TOKENS.has(token)) {
        throw new Error(`zone keepout encountered unsupported child "${token}"`)
      }
      if (entries.length > 1) {
        throw new Error(
          `zone keepout does not support repeated child "${token}"`,
        )
      }
    }
    keepout._sxTracks = propertyMap.tracks as ZoneKeepoutTracks | undefined
    keepout._sxVias = propertyMap.vias as ZoneKeepoutVias | undefined
    keepout._sxPads = propertyMap.pads as ZoneKeepoutPads | undefined
    keepout._sxCopperpour = propertyMap.copperpour as
      | ZoneKeepoutCopperpour
      | undefined
    keepout._sxFootprints = propertyMap.footprints as
      | ZoneKeepoutFootprints
      | undefined
    return keepout
  }

  get tracks(): string | undefined {
    return this._sxTracks?.value
  }

  set tracks(value: ZoneKeepoutTracks | string | undefined) {
    this._sxTracks =
      value === undefined
        ? undefined
        : value instanceof ZoneKeepoutTracks
          ? value
          : new ZoneKeepoutTracks(value)
  }

  get vias(): string | undefined {
    return this._sxVias?.value
  }

  set vias(value: ZoneKeepoutVias | string | undefined) {
    this._sxVias =
      value === undefined
        ? undefined
        : value instanceof ZoneKeepoutVias
          ? value
          : new ZoneKeepoutVias(value)
  }

  get pads(): string | undefined {
    return this._sxPads?.value
  }

  set pads(value: ZoneKeepoutPads | string | undefined) {
    this._sxPads =
      value === undefined
        ? undefined
        : value instanceof ZoneKeepoutPads
          ? value
          : new ZoneKeepoutPads(value)
  }

  get copperpour(): string | undefined {
    return this._sxCopperpour?.value
  }

  set copperpour(value: ZoneKeepoutCopperpour | string | undefined) {
    this._sxCopperpour =
      value === undefined
        ? undefined
        : value instanceof ZoneKeepoutCopperpour
          ? value
          : new ZoneKeepoutCopperpour(value)
  }

  get footprints(): string | undefined {
    return this._sxFootprints?.value
  }

  set footprints(value: ZoneKeepoutFootprints | string | undefined) {
    this._sxFootprints =
      value === undefined
        ? undefined
        : value instanceof ZoneKeepoutFootprints
          ? value
          : new ZoneKeepoutFootprints(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxTracks) children.push(this._sxTracks)
    if (this._sxVias) children.push(this._sxVias)
    if (this._sxPads) children.push(this._sxPads)
    if (this._sxCopperpour) children.push(this._sxCopperpour)
    if (this._sxFootprints) children.push(this._sxFootprints)
    return children
  }
}
SxClass.register(ZoneKeepout)
