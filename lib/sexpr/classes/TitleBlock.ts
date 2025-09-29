import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

function primitiveToString(value: PrimitiveSExpr | undefined): string {
  if (value === undefined) return ""
  const str = toStringValue(value)
  if (str !== undefined) return str
  return printSExpr(value)
}

export class TitleBlock extends SxClass {
  static override token = "title_block"
  token = "title_block"

  private _sxTitle?: TitleBlockTitle
  private _sxDate?: TitleBlockDate
  private _sxRev?: TitleBlockRevision
  private _sxCompany?: TitleBlockCompany
  comments: TitleBlockComment[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TitleBlock {
    const titleBlock = new TitleBlock()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `Unexpected primitive inside title_block: ${printSExpr(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `Unable to parse child node inside title_block: ${printSExpr(primitive)}`,
        )
      }

      if (parsed instanceof TitleBlockTitle) {
        titleBlock._sxTitle = parsed
        continue
      }
      if (parsed instanceof TitleBlockDate) {
        titleBlock._sxDate = parsed
        continue
      }
      if (parsed instanceof TitleBlockRevision) {
        titleBlock._sxRev = parsed
        continue
      }
      if (parsed instanceof TitleBlockCompany) {
        titleBlock._sxCompany = parsed
        continue
      }
      if (parsed instanceof TitleBlockComment) {
        titleBlock.comments.push(parsed)
        continue
      }

      throw new Error(
        `Unsupported child "${parsed.token}" inside title_block expression`,
      )
    }

    return titleBlock
  }

  get title(): string | undefined {
    return this._sxTitle?.value
  }

  set title(value: string | undefined) {
    this._sxTitle = value === undefined ? undefined : new TitleBlockTitle(value)
  }

  get date(): string | undefined {
    return this._sxDate?.value
  }

  set date(value: string | undefined) {
    this._sxDate = value === undefined ? undefined : new TitleBlockDate(value)
  }

  get rev(): string | undefined {
    return this._sxRev?.value
  }

  set rev(value: string | undefined) {
    this._sxRev =
      value === undefined ? undefined : new TitleBlockRevision(value)
  }

  get company(): string | undefined {
    return this._sxCompany?.value
  }

  set company(value: string | undefined) {
    this._sxCompany =
      value === undefined ? undefined : new TitleBlockCompany(value)
  }

  getComment(index: number): string | undefined {
    return this.comments.find((comment) => comment.index === index)?.value
  }

  setComment(index: number, value: string) {
    const existing = this.comments.find((comment) => comment.index === index)
    if (existing) {
      existing.value = value
      return
    }
    this.comments.push(new TitleBlockComment(index, value))
  }

  removeComment(index: number) {
    this.comments = this.comments.filter((comment) => comment.index !== index)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxTitle) children.push(this._sxTitle)
    if (this._sxDate) children.push(this._sxDate)
    if (this._sxRev) children.push(this._sxRev)
    if (this._sxCompany) children.push(this._sxCompany)

    const sortedComments = [...this.comments].sort((a, b) => a.index - b.index)
    children.push(...sortedComments)
    return children
  }

  override getString(): string {
    const lines: string[] = ["(title_block"]

    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(TitleBlock)

abstract class TitleBlockStringValue extends SxClass {
  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  override getChildren(): SxClass[] {
    return []
  }
}

export class TitleBlockTitle extends TitleBlockStringValue {
  static override token = "title"
  static override parentToken = "title_block"
  token = "title"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TitleBlockTitle {
    const [rawValue] = primitiveSexprs
    return new TitleBlockTitle(primitiveToString(rawValue))
  }

  override getString(): string {
    return `(title ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockTitle)

export class TitleBlockDate extends TitleBlockStringValue {
  static override token = "date"
  static override parentToken = "title_block"
  token = "date"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TitleBlockDate {
    const [rawValue] = primitiveSexprs
    return new TitleBlockDate(primitiveToString(rawValue))
  }

  override getString(): string {
    return `(date ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockDate)

export class TitleBlockRevision extends TitleBlockStringValue {
  static override token = "rev"
  static override parentToken = "title_block"
  token = "rev"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TitleBlockRevision {
    const [rawValue] = primitiveSexprs
    return new TitleBlockRevision(primitiveToString(rawValue))
  }

  override getString(): string {
    return `(rev ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockRevision)

export class TitleBlockCompany extends TitleBlockStringValue {
  static override token = "company"
  static override parentToken = "title_block"
  token = "company"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TitleBlockCompany {
    const [rawValue] = primitiveSexprs
    return new TitleBlockCompany(primitiveToString(rawValue))
  }

  override getString(): string {
    return `(company ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockCompany)

export class TitleBlockComment extends SxClass {
  static override token = "comment"
  static override parentToken = "title_block"
  token = "comment"

  index: number
  value: string
  private _sxAt?: At
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid

  constructor(index: number, value: string) {
    super()
    this.index = index
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TitleBlockComment {
    const [rawIndex, rawValue, ...rest] = primitiveSexprs
    const index = toNumberValue(rawIndex)
    if (index === undefined) {
      throw new Error("title_block comment requires a numeric index")
    }
    const value = primitiveToString(rawValue)
    const comment = new TitleBlockComment(index, value)

    for (const primitive of rest) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `Unexpected primitive inside title_block comment: ${printSExpr(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `Unable to parse child node inside title_block comment: ${printSExpr(primitive)}`,
        )
      }

      if (parsed instanceof At) {
        comment._sxAt = parsed
        continue
      }
      if (parsed instanceof TextEffects) {
        comment._sxEffects = parsed
        continue
      }
      if (parsed instanceof Uuid) {
        comment._sxUuid = parsed
        continue
      }

      throw new Error(
        `Unsupported child "${parsed.token}" inside title_block comment`,
      )
    }

    return comment
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: At | undefined) {
    this._sxAt = value
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

  set uuid(value: Uuid | undefined) {
    this._sxUuid = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    if (children.length === 0) {
      return `(comment ${this.index} ${quoteSExprString(this.value)})`
    }

    const lines = [`(comment ${this.index} ${quoteSExprString(this.value)}`]
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(TitleBlockComment)
