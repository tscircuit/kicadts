import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { At, type AtInput } from "./At"
import { ExcludeFromSim } from "./ExcludeFromSim"
import { FieldsAutoplaced } from "./FieldsAutoplaced"
import {
  HierarchicalLabelShape,
  type HierarchicalLabelShapeString,
} from "./HierarchicalLabelShape"
import { Property } from "./Property"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set([
  "shape",
  "at",
  "effects",
  "uuid",
  "fields_autoplaced",
  "exclude_from_sim",
  "property",
])

export interface HierarchicalLabelConstructorParams {
  value?: string
  shape?: HierarchicalLabelShapeString
  at?: AtInput
  effects?: TextEffects
  uuid?: string | Uuid
  fieldsAutoplaced?: boolean | FieldsAutoplaced
  excludeFromSim?: boolean | ExcludeFromSim
  properties?: Property[]
}

export class HierarchicalLabel extends SxClass {
  static override token = "hierarchical_label"
  static override parentToken = "kicad_sch"
  override token = "hierarchical_label"

  value = ""
  private _sxShape = new HierarchicalLabelShape("input")
  private _sxAt?: At
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid
  private _sxFieldsAutoplaced?: FieldsAutoplaced
  private _sxExcludeFromSim?: ExcludeFromSim
  private _properties: Property[] = []

  constructor(params: HierarchicalLabelConstructorParams = {}) {
    super()
    if (params.value !== undefined) this.value = params.value
    if (params.shape !== undefined) this.shape = params.shape
    if (params.at !== undefined) this.at = params.at
    if (params.effects !== undefined) this.effects = params.effects
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.fieldsAutoplaced !== undefined) {
      this._sxFieldsAutoplaced =
        params.fieldsAutoplaced instanceof FieldsAutoplaced
          ? params.fieldsAutoplaced
          : new FieldsAutoplaced(params.fieldsAutoplaced)
    }
    if (params.excludeFromSim !== undefined) {
      this._sxExcludeFromSim =
        params.excludeFromSim instanceof ExcludeFromSim
          ? params.excludeFromSim
          : new ExcludeFromSim(params.excludeFromSim)
    }
    if (params.properties !== undefined) this.properties = params.properties
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): HierarchicalLabel {
    const [value, ...children] = primitives
    if (typeof value !== "string") {
      throw new Error("hierarchical_label expects a string value")
    }
    if (
      children.some(
        (child) => !Array.isArray(child) || typeof child[0] !== "string",
      )
    ) {
      throw new Error("hierarchical_label expects child expressions")
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(children, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `Unsupported child token inside hierarchical_label: ${token}`,
        )
      }
      if (token !== "property" && entries.length > 1) {
        throw new Error(
          `hierarchical_label does not support repeated child token "${token}"`,
        )
      }
    }

    return new HierarchicalLabel({
      value,
      shape: (propertyMap.shape as HierarchicalLabelShape | undefined)?.value,
      at: propertyMap.at as At | undefined,
      effects: propertyMap.effects as TextEffects | undefined,
      uuid: propertyMap.uuid as Uuid | undefined,
      fieldsAutoplaced: propertyMap.fields_autoplaced as
        | FieldsAutoplaced
        | undefined,
      excludeFromSim: propertyMap.exclude_from_sim as
        | ExcludeFromSim
        | undefined,
      properties: arrayPropertyMap.property as Property[] | undefined,
    })
  }

  get shape(): HierarchicalLabelShapeString {
    return this._sxShape.value
  }

  set shape(value: HierarchicalLabelShapeString) {
    this._sxShape = new HierarchicalLabelShape(value)
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: AtInput | undefined) {
    this._sxAt = value === undefined ? undefined : At.from(value)
  }

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    this._sxUuid = typeof value === "string" ? new Uuid(value) : value
  }

  get fieldsAutoplaced(): boolean {
    return this._sxFieldsAutoplaced?.value ?? false
  }

  set fieldsAutoplaced(value: boolean) {
    this._sxFieldsAutoplaced = new FieldsAutoplaced(value)
  }

  get excludeFromSim(): boolean {
    return this._sxExcludeFromSim?.value ?? false
  }

  set excludeFromSim(value: boolean) {
    this._sxExcludeFromSim = new ExcludeFromSim(value)
  }

  get properties(): Property[] {
    return [...this._properties]
  }

  set properties(value: Property[]) {
    this._properties = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = [this._sxShape]
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxFieldsAutoplaced) children.push(this._sxFieldsAutoplaced)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxExcludeFromSim) children.push(this._sxExcludeFromSim)
    children.push(...this._properties)
    return children
  }

  override getString(): string {
    return [
      `(hierarchical_label ${quoteSExprString(this.value)}`,
      ...this.getChildren().map((child) => child.getStringIndented()),
      ")",
    ].join("\n")
  }
}
SxClass.register(HierarchicalLabel)
