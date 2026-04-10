import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteIfNeeded } from "../utils/quoteSExprString"
import "./TargetSize"
import type { At } from "./At"
import type { Layer } from "./Layer"
import type { TargetSize } from "./TargetSize"
import type { Uuid } from "./Uuid"
import type { Width } from "./Width"

const SUPPORTED_TOKENS = new Set(["at", "size", "width", "layer", "uuid"])

export class Target extends SxClass {
  static override token = "target"
  static override parentToken = "kicad_pcb"
  token = "target"

  private _shape: string
  private _sxAt?: At
  private _sxSize?: TargetSize
  private _sxWidth?: Width
  private _sxLayer?: Layer
  private _sxUuid?: Uuid

  constructor(shape: string) {
    super()
    this._shape = shape
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Target {
    const [rawShape, ...rest] = primitiveSexprs
    if (typeof rawShape !== "string") {
      throw new Error("target requires a shape string as its first argument")
    }

    const target = new Target(rawShape)

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`target does not support child token "${token}"`)
      }
      if (arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `target does not support repeated child token "${token}"`,
        )
      }
    }

    for (const primitive of rest) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `target encountered unexpected primitive child ${JSON.stringify(primitive)}`,
        )
      }
    }

    target._sxAt = propertyMap.at as At | undefined
    target._sxSize = propertyMap.size as TargetSize | undefined
    target._sxWidth = propertyMap.width as Width | undefined
    target._sxLayer = propertyMap.layer as Layer | undefined
    target._sxUuid = propertyMap.uuid as Uuid | undefined

    if (!target._sxAt) {
      throw new Error("target requires an at child token")
    }
    if (!target._sxSize) {
      throw new Error("target requires a size child token")
    }
    if (!target._sxWidth) {
      throw new Error("target requires a width child token")
    }
    if (!target._sxLayer) {
      throw new Error("target requires a layer child token")
    }
    if (!target._sxUuid) {
      throw new Error("target requires a uuid child token")
    }

    return target
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxSize) children.push(this._sxSize)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    if (children.length === 0) {
      return `(target ${quoteIfNeeded(this._shape)})`
    }

    const lines = [`(target ${quoteIfNeeded(this._shape)}`]
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Target)
