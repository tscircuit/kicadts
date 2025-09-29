import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { quoteSExprString } from "../../utils/quoteSExprString"
import { toNumberValue } from "../../utils/toNumberValue"
import { toStringValue } from "../../utils/toStringValue"

import {
  StackupLayerColor,
  StackupLayerEpsilonR,
  StackupLayerLossTangent,
  StackupLayerMaterial,
  StackupLayerThickness,
  StackupLayerType,
} from "./StackupLayerProperties"

export class StackupLayer extends SxClass {
  static override token = "layer"
  static override parentToken = "stackup"
  token = "layer"

  private _name: string
  private _number?: number

  private _sxType?: StackupLayerType
  private _sxColor?: StackupLayerColor
  private _sxThickness?: StackupLayerThickness
  private _sxMaterial?: StackupLayerMaterial
  private _sxEpsilonR?: StackupLayerEpsilonR
  private _sxLossTangent?: StackupLayerLossTangent

  constructor(
    name: string,
    opts: {
      number?: number
      type?: StackupLayerType
      color?: StackupLayerColor
      thickness?: StackupLayerThickness
      material?: StackupLayerMaterial
      epsilonR?: StackupLayerEpsilonR
      lossTangent?: StackupLayerLossTangent
    } = {},
  ) {
    super()
    this._name = name
    this._number = opts.number
    this._sxType = opts.type
    this._sxColor = opts.color
    this._sxThickness = opts.thickness
    this._sxMaterial = opts.material
    this._sxEpsilonR = opts.epsilonR
    this._sxLossTangent = opts.lossTangent
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): StackupLayer {
    if (primitiveSexprs.length === 0) {
      throw new Error("Stackup layer requires at least a name")
    }

    const name = toStringValue(primitiveSexprs[0])
    if (name === undefined) {
      throw new Error("Stackup layer name must be a string")
    }

    let propertyIndex = 1
    let number: number | undefined
    const maybeNumber = primitiveSexprs[propertyIndex]
    const numericLayerNumber = toNumberValue(maybeNumber)
    if (numericLayerNumber !== undefined) {
      number = numericLayerNumber
      propertyIndex += 1
    }

    const propertyPrimitives = primitiveSexprs.slice(propertyIndex)
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      propertyPrimitives,
      this.token,
    )

    return new StackupLayer(name, {
      number,
      type: propertyMap.type as StackupLayerType,
      color: propertyMap.color as StackupLayerColor,
      thickness: propertyMap.thickness as StackupLayerThickness,
      material: propertyMap.material as StackupLayerMaterial,
      epsilonR: propertyMap.epsilon_r as StackupLayerEpsilonR,
      lossTangent: propertyMap.loss_tangent as StackupLayerLossTangent,
    })
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    const parsed = toStringValue(value)
    if (parsed === undefined) {
      throw new Error("Stackup layer name must be a string")
    }
    this._name = parsed
  }

  get number(): number | undefined {
    return this._number
  }

  set number(value: number | undefined) {
    if (value === undefined) {
      this._number = undefined
      return
    }
    const parsed = toNumberValue(value)
    if (parsed === undefined) {
      throw new Error("Stackup layer number must be numeric")
    }
    this._number = parsed
  }

  get type(): string | undefined {
    return this._sxType?.value
  }

  set type(value: string | StackupLayerType | undefined) {
    if (value === undefined) {
      this._sxType = undefined
      return
    }
    this._sxType =
      value instanceof StackupLayerType ? value : new StackupLayerType(value)
  }

  get color(): string | undefined {
    return this._sxColor?.value
  }

  set color(value: string | StackupLayerColor | undefined) {
    if (value === undefined) {
      this._sxColor = undefined
      return
    }
    this._sxColor =
      value instanceof StackupLayerColor ? value : new StackupLayerColor(value)
  }

  get thickness(): number | undefined {
    return this._sxThickness?.value
  }

  set thickness(value: number | StackupLayerThickness | undefined) {
    if (value === undefined) {
      this._sxThickness = undefined
      return
    }
    this._sxThickness =
      value instanceof StackupLayerThickness
        ? value
        : new StackupLayerThickness(value)
  }

  get material(): string | undefined {
    return this._sxMaterial?.value
  }

  set material(value: string | StackupLayerMaterial | undefined) {
    if (value === undefined) {
      this._sxMaterial = undefined
      return
    }
    this._sxMaterial =
      value instanceof StackupLayerMaterial
        ? value
        : new StackupLayerMaterial(value)
  }

  get epsilonR(): number | undefined {
    return this._sxEpsilonR?.value
  }

  set epsilonR(value: number | StackupLayerEpsilonR | undefined) {
    if (value === undefined) {
      this._sxEpsilonR = undefined
      return
    }
    this._sxEpsilonR =
      value instanceof StackupLayerEpsilonR
        ? value
        : new StackupLayerEpsilonR(value)
  }

  get lossTangent(): number | undefined {
    return this._sxLossTangent?.value
  }

  set lossTangent(value: number | StackupLayerLossTangent | undefined) {
    if (value === undefined) {
      this._sxLossTangent = undefined
      return
    }
    this._sxLossTangent =
      value instanceof StackupLayerLossTangent
        ? value
        : new StackupLayerLossTangent(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxType) children.push(this._sxType)
    if (this._sxColor) children.push(this._sxColor)
    if (this._sxThickness) children.push(this._sxThickness)
    if (this._sxMaterial) children.push(this._sxMaterial)
    if (this._sxEpsilonR) children.push(this._sxEpsilonR)
    if (this._sxLossTangent) children.push(this._sxLossTangent)
    return children
  }

  override getString(): string {
    const header = `(layer ${quoteSExprString(this._name)}${
      this._number !== undefined ? ` ${this._number}` : ""
    }`
    const children = this.getChildren()
    if (children.length === 0) {
      return `${header})`
    }
    const lines: string[] = [header]
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(StackupLayer)
