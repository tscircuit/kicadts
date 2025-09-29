import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export type PadOptionsClearanceType = "outline" | "convexhull"
export type PadOptionsAnchorShape = "rect" | "circle"

const CLEARANCE_TYPES: PadOptionsClearanceType[] = ["outline", "convexhull"]

const ANCHOR_SHAPES: PadOptionsAnchorShape[] = ["rect", "circle"]

export class PadOptions extends SxClass {
  static override token = "options"
  static override parentToken = "pad"
  override token = "options"

  private _sxClearance?: PadOptionsClearance
  private _sxAnchor?: PadOptionsAnchor

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadOptions {
    const options = new PadOptions()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `pad options encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `pad options child did not resolve to an SxClass: ${JSON.stringify(primitive)}`,
        )
      }

      if (parsed instanceof PadOptionsClearance) {
        if (options._sxClearance) {
          throw new Error("pad options encountered duplicate clearance tokens")
        }
        options._sxClearance = parsed
        continue
      }

      if (parsed instanceof PadOptionsAnchor) {
        if (options._sxAnchor) {
          throw new Error("pad options encountered duplicate anchor tokens")
        }
        options._sxAnchor = parsed
        continue
      }

      throw new Error(
        `pad options encountered unsupported token "${parsed.token}"`,
      )
    }

    return options
  }

  get clearance(): PadOptionsClearanceType | undefined {
    return this._sxClearance?.type
  }

  set clearance(value: PadOptionsClearanceType | undefined) {
    this._sxClearance = value ? new PadOptionsClearance(value) : undefined
  }

  get anchor(): PadOptionsAnchorShape | undefined {
    return this._sxAnchor?.shape
  }

  set anchor(value: PadOptionsAnchorShape | undefined) {
    this._sxAnchor = value ? new PadOptionsAnchor(value) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxClearance) children.push(this._sxClearance)
    if (this._sxAnchor) children.push(this._sxAnchor)
    return children
  }
}
SxClass.register(PadOptions)

class PadOptionsClearance extends SxClass {
  static override token = "clearance"
  static override parentToken = "options"
  override token = "clearance"

  private _type: PadOptionsClearanceType

  constructor(type: PadOptionsClearanceType) {
    super()
    this._type = type
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadOptionsClearance {
    const [raw] = primitiveSexprs
    const stringValue = toStringValue(raw)
    if (stringValue === undefined) {
      throw new Error("pad options clearance requires a string value")
    }
    if (!CLEARANCE_TYPES.includes(stringValue as PadOptionsClearanceType)) {
      throw new Error(
        `pad options clearance must be one of ${CLEARANCE_TYPES.join(", ")}`,
      )
    }
    return new PadOptionsClearance(stringValue as PadOptionsClearanceType)
  }

  get type(): PadOptionsClearanceType {
    return this._type
  }

  set type(value: PadOptionsClearanceType) {
    this._type = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(clearance ${this._type})`
  }
}
SxClass.register(PadOptionsClearance)

class PadOptionsAnchor extends SxClass {
  static override token = "anchor"
  static override parentToken = "options"
  override token = "anchor"

  private _shape: PadOptionsAnchorShape

  constructor(shape: PadOptionsAnchorShape) {
    super()
    this._shape = shape
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadOptionsAnchor {
    const [raw] = primitiveSexprs
    const stringValue = toStringValue(raw)
    if (stringValue === undefined) {
      throw new Error("pad options anchor requires a string value")
    }
    if (!ANCHOR_SHAPES.includes(stringValue as PadOptionsAnchorShape)) {
      throw new Error(
        `pad options anchor must be one of ${ANCHOR_SHAPES.join(", ")}`,
      )
    }
    return new PadOptionsAnchor(stringValue as PadOptionsAnchorShape)
  }

  get shape(): PadOptionsAnchorShape {
    return this._shape
  }

  set shape(value: PadOptionsAnchorShape) {
    this._shape = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(anchor ${this._shape})`
  }
}
SxClass.register(PadOptionsAnchor)
