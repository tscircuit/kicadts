import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { At } from "./At"

export class FootprintTransform extends SxClass {
  static override token = "transform"
  static override parentToken = "footprint"
  token = "transform"

  constructor(
    public translate?: FootprintTransformTranslate,
    public rotate?: FootprintTransformRotate,
    public scale?: FootprintTransformScale,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintTransform {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )
    return new FootprintTransform(
      propertyMap.translate as FootprintTransformTranslate | undefined,
      propertyMap.rotate as FootprintTransformRotate | undefined,
      propertyMap.scale as FootprintTransformScale | undefined,
    )
  }

  toAt(): At | undefined {
    if (!this.translate) return undefined
    return new At([this.translate.x, this.translate.y, this.rotate?.angle])
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this.translate) children.push(this.translate)
    if (this.rotate) children.push(this.rotate)
    if (this.scale) children.push(this.scale)
    return children
  }
}
SxClass.register(FootprintTransform)

export class FootprintTransformTranslate extends SxClass {
  static override token = "translate"
  static override parentToken = "transform"
  token = "translate"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintTransformTranslate {
    return new FootprintTransformTranslate(
      toNumberValue(primitiveSexprs[0]) ?? 0,
      toNumberValue(primitiveSexprs[1]) ?? 0,
    )
  }

  override getString(): string {
    return `(translate ${this.x} ${this.y})`
  }
}
SxClass.register(FootprintTransformTranslate)

export class FootprintTransformRotate extends SxClass {
  static override token = "rotate"
  static override parentToken = "transform"
  token = "rotate"

  constructor(public angle: number) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintTransformRotate {
    return new FootprintTransformRotate(toNumberValue(primitiveSexprs[0]) ?? 0)
  }

  override getString(): string {
    return `(rotate ${this.angle})`
  }
}
SxClass.register(FootprintTransformRotate)

export class FootprintTransformScale extends SxClass {
  static override token = "scale"
  static override parentToken = "transform"
  token = "scale"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintTransformScale {
    return new FootprintTransformScale(
      toNumberValue(primitiveSexprs[0]) ?? 1,
      toNumberValue(primitiveSexprs[1]) ?? 1,
    )
  }

  override getString(): string {
    return `(scale ${this.x} ${this.y})`
  }
}
SxClass.register(FootprintTransformScale)
