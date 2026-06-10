import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export interface ModelVector {
  x: number
  y: number
  z: number
}

const DEFAULT_VECTOR: ModelVector = { x: 0, y: 0, z: 0 }

export class FootprintModel extends SxClass {
  static override token = "model"
  static override parentToken = "footprint"
  override token = "model"

  private _path: string
  private _offset?: ModelVector
  private _scale?: ModelVector
  private _rotate?: ModelVector
  private _opacity?: number
  private _hide = false

  constructor(path: string) {
    super()
    this._path = path
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintModel {
    if (primitiveSexprs.length === 0) {
      throw new Error("model requires a path argument")
    }

    const [rawPath, ...rest] = primitiveSexprs
    const path = toStringValue(rawPath)
    if (path === undefined) {
      throw new Error("model path must be a string value")
    }

    const model = new FootprintModel(path)

    for (const primitive of rest) {
      if (typeof primitive === "string") {
        if (primitive === "hide") {
          model._hide = true
          continue
        }
        throw new Error(`model encountered unsupported flag "${primitive}"`)
      }
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `model encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }
      const [token, ...args] = primitive
      if (token === "offset" || token === "at") {
        model._offset = parseVectorArgs(args, "offset")
        continue
      }
      if (token === "scale") {
        model._scale = parseVectorArgs(args, "scale")
        continue
      }
      if (token === "rotate") {
        model._rotate = parseVectorArgs(args, "rotate")
        continue
      }
      if (token === "opacity") {
        model._opacity = parseOpacityArgs(args)
        continue
      }
      if (token === "hide") {
        model._hide = parseHideArgs(args)
        continue
      }
      throw new Error(`model encountered unsupported child token "${token}"`)
    }

    return model
  }

  get path(): string {
    return this._path
  }

  set path(value: string) {
    this._path = value
  }

  get offset(): ModelVector | undefined {
    return this._offset ? { ...this._offset } : undefined
  }

  set offset(value: ModelVector | undefined) {
    this._offset = value ? { ...value } : undefined
  }

  get scale(): ModelVector | undefined {
    return this._scale ? { ...this._scale } : undefined
  }

  set scale(value: ModelVector | undefined) {
    this._scale = value ? { ...value } : undefined
  }

  get rotate(): ModelVector | undefined {
    return this._rotate ? { ...this._rotate } : undefined
  }

  set rotate(value: ModelVector | undefined) {
    this._rotate = value ? { ...value } : undefined
  }

  get opacity(): number | undefined {
    return this._opacity
  }

  set opacity(value: number | undefined) {
    this._opacity = value
  }

  get hide(): boolean {
    return this._hide
  }

  set hide(value: boolean) {
    this._hide = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const lines = [`(model ${quoteSExprString(this._path)}`]
    if (this._hide) {
      lines.push("  (hide yes)")
    }
    if (this._opacity !== undefined) {
      lines.push(`  (opacity ${this._opacity})`)
    }
    if (this._offset) {
      lines.push(renderVectorBlock("offset", this._offset))
    }
    if (this._scale) {
      lines.push(renderVectorBlock("scale", this._scale))
    }
    if (this._rotate) {
      lines.push(renderVectorBlock("rotate", this._rotate))
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FootprintModel)

function parseVectorArgs(args: PrimitiveSExpr[], token: string): ModelVector {
  if (args.length !== 1) {
    throw new Error(`model ${token} expects a single xyz child`)
  }
  const [first] = args
  if (!Array.isArray(first) || first.length !== 4 || first[0] !== "xyz") {
    throw new Error(
      `model ${token} expects (xyz x y z), received ${JSON.stringify(first)}`,
    )
  }
  const [, rawX, rawY, rawZ] = first
  const x = toNumberValue(rawX) ?? DEFAULT_VECTOR.x
  const y = toNumberValue(rawY) ?? DEFAULT_VECTOR.y
  const z = toNumberValue(rawZ) ?? DEFAULT_VECTOR.z
  return { x, y, z }
}

function renderVectorBlock(label: string, vector: ModelVector): string {
  return `  (${label}\n    (xyz ${vector.x} ${vector.y} ${vector.z})\n  )`
}

function parseHideArgs(args: PrimitiveSExpr[]): boolean {
  if (args.length === 0) {
    return true
  }
  if (args.length > 1) {
    throw new Error("model hide expects at most one value")
  }

  const parsed = parseYesNo(args[0])
  if (parsed === undefined) {
    throw new Error(
      `model hide expects yes/no, received ${JSON.stringify(args[0])}`,
    )
  }
  return parsed
}

function parseOpacityArgs(args: PrimitiveSExpr[]): number {
  if (args.length !== 1) {
    throw new Error("model opacity expects a single number")
  }
  const opacity = toNumberValue(args[0])
  if (opacity === undefined) {
    throw new Error(
      `model opacity expects a number, received ${JSON.stringify(args[0])}`,
    )
  }
  return opacity
}
