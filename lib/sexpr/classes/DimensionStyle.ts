import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import "./DimensionArrowDirection"
import "./DimensionArrowLength"
import "./DimensionExtensionHeight"
import "./DimensionExtensionOffset"
import "./DimensionKeepTextAligned"
import "./DimensionStyleThickness"
import "./DimensionTextFrame"
import "./DimensionTextPositionMode"
import type { DimensionArrowDirection } from "./DimensionArrowDirection"
import type { DimensionArrowLength } from "./DimensionArrowLength"
import type { DimensionExtensionHeight } from "./DimensionExtensionHeight"
import type { DimensionExtensionOffset } from "./DimensionExtensionOffset"
import type { DimensionKeepTextAligned } from "./DimensionKeepTextAligned"
import type { DimensionStyleThickness } from "./DimensionStyleThickness"
import type { DimensionTextFrame } from "./DimensionTextFrame"
import type { DimensionTextPositionMode } from "./DimensionTextPositionMode"

const SUPPORTED_TOKENS = new Set([
  "thickness",
  "arrow_length",
  "text_position_mode",
  "arrow_direction",
  "extension_height",
  "text_frame",
  "extension_offset",
  "keep_text_aligned",
])

export class DimensionStyle extends SxClass {
  static override token = "style"
  static override parentToken = "dimension"
  token = "style"

  private _sxThickness?: DimensionStyleThickness
  private _sxArrowLength?: DimensionArrowLength
  private _sxTextPositionMode?: DimensionTextPositionMode
  private _sxArrowDirection?: DimensionArrowDirection
  private _sxExtensionHeight?: DimensionExtensionHeight
  private _sxTextFrame?: DimensionTextFrame
  private _sxExtensionOffset?: DimensionExtensionOffset
  private _sxKeepTextAligned?: DimensionKeepTextAligned

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DimensionStyle {
    const style = new DimensionStyle()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(`style does not support child token "${token}"`)
      }
      if (arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `style does not support repeated child token "${token}"`,
        )
      }
    }

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `style encountered unexpected primitive child ${JSON.stringify(primitive)}`,
        )
      }
    }

    style._sxThickness = propertyMap.thickness as
      | DimensionStyleThickness
      | undefined
    style._sxArrowLength = propertyMap.arrow_length as
      | DimensionArrowLength
      | undefined
    style._sxTextPositionMode = propertyMap.text_position_mode as
      | DimensionTextPositionMode
      | undefined
    style._sxArrowDirection = propertyMap.arrow_direction as
      | DimensionArrowDirection
      | undefined
    style._sxExtensionHeight = propertyMap.extension_height as
      | DimensionExtensionHeight
      | undefined
    style._sxTextFrame = propertyMap.text_frame as
      | DimensionTextFrame
      | undefined
    style._sxExtensionOffset = propertyMap.extension_offset as
      | DimensionExtensionOffset
      | undefined
    style._sxKeepTextAligned = propertyMap.keep_text_aligned as
      | DimensionKeepTextAligned
      | undefined

    if (!style._sxThickness) {
      throw new Error("style requires a thickness child token")
    }
    if (!style._sxArrowLength) {
      throw new Error("style requires an arrow_length child token")
    }
    if (!style._sxTextPositionMode) {
      throw new Error("style requires a text_position_mode child token")
    }

    return style
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxThickness) children.push(this._sxThickness)
    if (this._sxArrowLength) children.push(this._sxArrowLength)
    if (this._sxTextPositionMode) children.push(this._sxTextPositionMode)
    if (this._sxArrowDirection) children.push(this._sxArrowDirection)
    if (this._sxExtensionHeight) children.push(this._sxExtensionHeight)
    if (this._sxTextFrame) children.push(this._sxTextFrame)
    if (this._sxExtensionOffset) children.push(this._sxExtensionOffset)
    if (this._sxKeepTextAligned) children.push(this._sxKeepTextAligned)
    return children
  }
}
SxClass.register(DimensionStyle)
