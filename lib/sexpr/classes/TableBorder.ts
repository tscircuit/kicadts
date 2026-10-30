import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseTableProperties } from "../utils/parseTableProperties"
import { Stroke } from "./Stroke"
import { TableBorderExternal } from "./TableBorderExternal"
import { TableBorderHeader } from "./TableBorderHeader"

export interface TableBorderConstructorParams {
  external?: boolean
  header?: boolean
  stroke?: Stroke
}

export class TableBorder extends SxClass {
  static override token = "border"
  static override parentToken = "table"
  override token = "border"
  private _sxExternal?: TableBorderExternal
  private _sxHeader?: TableBorderHeader
  private _sxStroke?: Stroke

  constructor(params: TableBorderConstructorParams = {}) {
    super()
    if (params.external !== undefined) this.external = params.external
    if (params.header !== undefined) this.header = params.header
    this.stroke = params.stroke
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableBorder {
    const { propertyMap } = parseTableProperties(primitives, this.token, [
      "external",
      "header",
      "stroke",
    ])
    const result = new TableBorder()
    result._sxExternal = propertyMap.external as TableBorderExternal | undefined
    result._sxHeader = propertyMap.header as TableBorderHeader | undefined
    result._sxStroke = propertyMap.stroke as Stroke | undefined
    return result
  }

  get external(): boolean | undefined {
    return this._sxExternal?.value
  }
  set external(value: boolean | undefined) {
    this._sxExternal =
      value === undefined ? undefined : new TableBorderExternal(value)
  }

  get header(): boolean | undefined {
    return this._sxHeader?.value
  }
  set header(value: boolean | undefined) {
    this._sxHeader =
      value === undefined ? undefined : new TableBorderHeader(value)
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }
  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxExternal) children.push(this._sxExternal)
    if (this._sxHeader) children.push(this._sxHeader)
    if (this._sxStroke) children.push(this._sxStroke)
    return children
  }
}
SxClass.register(TableBorder)
