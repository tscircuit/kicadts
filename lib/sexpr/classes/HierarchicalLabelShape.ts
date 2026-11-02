import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export type HierarchicalLabelShapeString =
  | "input"
  | "output"
  | "bidirectional"
  | "tri_state"
  | "passive"

const SHAPES = new Set<HierarchicalLabelShapeString>([
  "input",
  "output",
  "bidirectional",
  "tri_state",
  "passive",
])

export class HierarchicalLabelShape extends SxClass {
  static override token = "shape"
  static override parentToken = "hierarchical_label"
  override token = "shape"

  constructor(public value: HierarchicalLabelShapeString) {
    super()
    if (!SHAPES.has(value)) {
      throw new Error(`Invalid hierarchical label shape: ${value}`)
    }
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): HierarchicalLabelShape {
    const [value] = primitives
    if (primitives.length !== 1 || typeof value !== "string") {
      throw new Error("hierarchical label shape expects one shape name")
    }
    return new HierarchicalLabelShape(value as HierarchicalLabelShapeString)
  }

  override getString(): string {
    return `(shape ${this.value})`
  }
}
SxClass.register(HierarchicalLabelShape)
