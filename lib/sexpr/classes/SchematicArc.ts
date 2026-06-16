import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Stroke } from "./Stroke"
import {
  SymbolArcEnd,
  SymbolArcFill,
  SymbolArcMid,
  SymbolArcStart,
} from "./Symbol"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set([
  "start",
  "mid",
  "end",
  "stroke",
  "fill",
  "uuid",
  "locked",
])

export interface SchematicArcPoint {
  x: number
  y: number
}

export interface SchematicArcConstructorParams {
  start?: SymbolArcStart | SchematicArcPoint
  mid?: SymbolArcMid | SchematicArcPoint
  end?: SymbolArcEnd | SchematicArcPoint
  stroke?: Stroke
  fill?: SymbolArcFill
  uuid?: string | Uuid
  locked?: boolean
}

export class SchematicArcLocked extends SxClass {
  static override token = "locked"
  static override parentToken = "arc"
  override token = "locked"

  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicArcLocked {
    const [valuePrimitive] = primitiveSexprs
    if (typeof valuePrimitive !== "boolean") {
      throw new Error("locked expects a boolean value")
    }
    return new SchematicArcLocked(valuePrimitive)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(locked ${this.value})`
  }
}
SxClass.register(SchematicArcLocked)

export class SchematicArc extends SxClass {
  static override token = "arc"
  static override parentToken = "kicad_sch"
  override token = "arc"

  private _sxStart?: SymbolArcStart
  private _sxMid?: SymbolArcMid
  private _sxEnd?: SymbolArcEnd
  private _sxStroke?: Stroke
  private _sxFill?: SymbolArcFill
  private _sxUuid?: Uuid
  private _sxLocked?: SchematicArcLocked

  constructor(params: SchematicArcConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.mid !== undefined) this.mid = params.mid
    if (params.end !== undefined) this.end = params.end
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.fill !== undefined) this.fill = params.fill
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicArc {
    const arc = new SchematicArc()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`arc encountered unsupported child token "${token}"`)
      }
      if (entries.length > 1) {
        throw new Error(`arc does not support repeated child token "${token}"`)
      }
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside arc expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    arc._sxStart = propertyMap.start as SymbolArcStart | undefined
    arc._sxMid = propertyMap.mid as SymbolArcMid | undefined
    arc._sxEnd = propertyMap.end as SymbolArcEnd | undefined
    arc._sxStroke = propertyMap.stroke as Stroke | undefined
    arc._sxFill = propertyMap.fill as SymbolArcFill | undefined
    arc._sxUuid = propertyMap.uuid as Uuid | undefined
    arc._sxLocked = propertyMap.locked as SchematicArcLocked | undefined

    return arc
  }

  get start(): SymbolArcStart | undefined {
    return this._sxStart
  }

  set start(value: SymbolArcStart | SchematicArcPoint | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    this._sxStart =
      value instanceof SymbolArcStart ? value : new SymbolArcStart(value.x, value.y)
  }

  get mid(): SymbolArcMid | undefined {
    return this._sxMid
  }

  set mid(value: SymbolArcMid | SchematicArcPoint | undefined) {
    if (value === undefined) {
      this._sxMid = undefined
      return
    }
    this._sxMid =
      value instanceof SymbolArcMid ? value : new SymbolArcMid(value.x, value.y)
  }

  get end(): SymbolArcEnd | undefined {
    return this._sxEnd
  }

  set end(value: SymbolArcEnd | SchematicArcPoint | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    this._sxEnd =
      value instanceof SymbolArcEnd ? value : new SymbolArcEnd(value.x, value.y)
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get fill(): SymbolArcFill | undefined {
    return this._sxFill
  }

  set fill(value: SymbolArcFill | undefined) {
    this._sxFill = value
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
    this._sxLocked = value ? new SchematicArcLocked(true) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxMid) children.push(this._sxMid)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxLocked) children.push(this._sxLocked)
    return children
  }
}
SxClass.register(SchematicArc)
