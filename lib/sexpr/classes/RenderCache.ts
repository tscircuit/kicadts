import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { Pts } from "./Pts"

type RenderCacheElement = RenderCachePolygon

export class RenderCache extends SxClass {
  static override token = "render_cache"
  override token = "render_cache"

  private _text: string
  private _angle?: number
  private _offsetX?: number
  private _offsetY?: number
  private _elements: RenderCacheElement[] = []

  constructor(text = "") {
    super()
    this._text = text
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): RenderCache {
    if (primitiveSexprs.length === 0) {
      throw new Error("render_cache requires a text argument")
    }

    const [rawText, ...rest] = primitiveSexprs
    const text = toStringValue(rawText)
    if (text === undefined) {
      throw new Error(
        `render_cache text must be a string value, received ${JSON.stringify(rawText)}`,
      )
    }

    const renderCache = new RenderCache(text)

    const numericParams: number[] = []

    for (const primitive of rest) {
      if (Array.isArray(primitive)) {
        const parsed = SxClass.parsePrimitiveSexpr(primitive, {
          parentToken: this.token,
        })
        if (!(parsed instanceof SxClass)) {
          throw new Error(
            `render_cache child did not resolve to an SxClass: ${JSON.stringify(primitive)}`,
          )
        }

        if (!(parsed instanceof RenderCachePolygon)) {
          throw new Error(
            `render_cache encountered unsupported child token "${parsed.token}"`,
          )
        }

        renderCache._elements.push(parsed)
        continue
      }

      const numeric = toNumberValue(primitive)
      if (numeric === undefined) {
        throw new Error(
          `render_cache encountered non-numeric parameter ${JSON.stringify(primitive)}`,
        )
      }
      numericParams.push(numeric)
    }

    if (numericParams.length > 0) {
      renderCache._angle = numericParams[0]
    }
    if (numericParams.length > 1) {
      renderCache._offsetX = numericParams[1]
    }
    if (numericParams.length > 2) {
      renderCache._offsetY = numericParams[2]
    }
    if (numericParams.length > 3) {
      throw new Error("render_cache supports at most three numeric parameters")
    }

    return renderCache
  }

  get text(): string {
    return this._text
  }

  set text(value: string) {
    this._text = value
  }

  get angle(): number | undefined {
    return this._angle
  }

  set angle(value: number | undefined) {
    this._angle = value
  }

  get offsetX(): number | undefined {
    return this._offsetX
  }

  set offsetX(value: number | undefined) {
    this._offsetX = value
  }

  get offsetY(): number | undefined {
    return this._offsetY
  }

  set offsetY(value: number | undefined) {
    this._offsetY = value
  }

  get elements(): RenderCacheElement[] {
    return [...this._elements]
  }

  set elements(elements: RenderCacheElement[]) {
    this._elements = [...elements]
  }

  addElement(element: RenderCacheElement) {
    this._elements.push(element)
  }

  override getChildren(): SxClass[] {
    return [...this._elements]
  }

  override getString(): string {
    const headerParts: string[] = [quoteSExprString(this._text)]
    if (this._angle !== undefined) {
      headerParts.push(String(this._angle))
    }
    if (this._offsetX !== undefined) {
      headerParts.push(String(this._offsetX))
    }
    if (this._offsetY !== undefined) {
      headerParts.push(String(this._offsetY))
    }

    if (this._elements.length === 0) {
      return `(render_cache ${headerParts.join(" ")})`
    }

    const lines = [`(render_cache ${headerParts.join(" ")}`]
    for (const element of this._elements) {
      lines.push(element.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(RenderCache)

class RenderCachePolygon extends SxClass {
  static override token = "polygon"
  static override parentToken = "render_cache"
  override token = "polygon"

  private _contours: Pts[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): RenderCachePolygon {
    const polygon = new RenderCachePolygon()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `render_cache polygon encountered invalid child: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `render_cache polygon child did not resolve to an SxClass: ${JSON.stringify(primitive)}`,
        )
      }

      if (!(parsed instanceof Pts)) {
        throw new Error(
          `render_cache polygon encountered unsupported token "${parsed.token}"`,
        )
      }

      polygon._contours.push(parsed)
    }

    if (polygon._contours.length === 0) {
      throw new Error("render_cache polygon requires at least one pts child")
    }

    return polygon
  }

  get contours(): Pts[] {
    return [...this._contours]
  }

  set contours(value: Pts[]) {
    this._contours = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._contours]
  }
}
SxClass.register(RenderCachePolygon)
