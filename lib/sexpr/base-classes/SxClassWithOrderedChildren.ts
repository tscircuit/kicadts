import { SxClass } from "./SxClass"

export abstract class SxClassWithOrderedChildren<
  ChildrenType extends SxClass,
> extends SxClass {
  children: ChildrenType[]

  constructor(children: ChildrenType[] = []) {
    super()
    if (!Array.isArray(children)) {
      throw new Error(
        `${this.constructor.name} expects an array of children when constructed`,
      )
    }

    for (const child of children) {
      if (!(child instanceof SxClass)) {
        throw new Error(`${this.constructor.name} children must extend SxClass`)
      }
    }

    this.children = [...children]
  }

  override getString(): string {
    const lines = [`(${this.token}`]

    for (const child of this.children) {
      const childLines = child.getString().split("\n")
      for (const childLine of childLines) {
        lines.push(`  ${childLine}`)
      }
    }

    lines.push(")")
    return lines.join("\n")
  }
}
