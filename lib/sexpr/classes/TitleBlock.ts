import { SxClass } from "../base-classes/SxClass"

const quoteSExprString = (value: string): string => {
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")}"`
}

type TitleBlockStringProperty =
  | TitleBlockTitle
  | TitleBlockDate
  | TitleBlockRevision
  | TitleBlockCompany
export type TitleBlockProperty = TitleBlockStringProperty | TitleBlockComment

export class TitleBlock extends SxClass {
  static override token = "title_block"
  token = "title_block"

  override _propertyMap: {
    title?: TitleBlockTitle
    date?: TitleBlockDate
    rev?: TitleBlockRevision
    company?: TitleBlockCompany
  } = {}

  comments: TitleBlockComment[] = []

  constructor(args: Array<TitleBlockProperty>) {
    super()

    const stringProps: TitleBlockStringProperty[] = []
    for (const arg of args) {
      if (arg instanceof TitleBlockComment) {
        this.comments.push(arg)
        continue
      }
      stringProps.push(arg)
    }

    if (stringProps.length > 0) {
      this.loadProperties(stringProps)
    }
  }

  get title(): string | undefined {
    return this._propertyMap.title?.value
  }

  set title(value: string | undefined) {
    if (value === undefined) {
      delete this._propertyMap.title
      return
    }
    this._propertyMap.title = new TitleBlockTitle([value])
  }

  get date(): string | undefined {
    return this._propertyMap.date?.value
  }

  set date(value: string | undefined) {
    if (value === undefined) {
      delete this._propertyMap.date
      return
    }
    this._propertyMap.date = new TitleBlockDate([value])
  }

  get rev(): string | undefined {
    return this._propertyMap.rev?.value
  }

  set rev(value: string | undefined) {
    if (value === undefined) {
      delete this._propertyMap.rev
      return
    }
    this._propertyMap.rev = new TitleBlockRevision([value])
  }

  get company(): string | undefined {
    return this._propertyMap.company?.value
  }

  set company(value: string | undefined) {
    if (value === undefined) {
      delete this._propertyMap.company
      return
    }
    this._propertyMap.company = new TitleBlockCompany([value])
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
    this.comments.push(new TitleBlockComment([index, value]))
  }

  removeComment(index: number) {
    this.comments = this.comments.filter((comment) => comment.index !== index)
  }

  override getString(): string {
    const lines: string[] = ["(title_block"]

    if (this._propertyMap.title) {
      lines.push(`  ${this._propertyMap.title.getString()}`)
    }
    if (this._propertyMap.date) {
      lines.push(`  ${this._propertyMap.date.getString()}`)
    }
    if (this._propertyMap.rev) {
      lines.push(`  ${this._propertyMap.rev.getString()}`)
    }
    if (this._propertyMap.company) {
      lines.push(`  ${this._propertyMap.company.getString()}`)
    }

    const sortedComments = [...this.comments].sort(
      (a, b) => a.index - b.index,
    )
    for (const comment of sortedComments) {
      lines.push(`  ${comment.getString()}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(TitleBlock)

abstract class TitleBlockStringValue extends SxClass {
  value: string

  constructor(args: [value: string]) {
    super()
    this.value = args[0]
  }
}

export class TitleBlockTitle extends TitleBlockStringValue {
  static override token = "title"
  static override parentToken = "title_block"
  token = "title"

  override getString(): string {
    return `(title ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockTitle)

export class TitleBlockDate extends TitleBlockStringValue {
  static override token = "date"
  static override parentToken = "title_block"
  token = "date"

  override getString(): string {
    return `(date ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockDate)

export class TitleBlockRevision extends TitleBlockStringValue {
  static override token = "rev"
  static override parentToken = "title_block"
  token = "rev"

  override getString(): string {
    return `(rev ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockRevision)

export class TitleBlockCompany extends TitleBlockStringValue {
  static override token = "company"
  static override parentToken = "title_block"
  token = "company"

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

  constructor(args: [index: number, value: string]) {
    super()
    this.index = args[0]
    this.value = args[1]
  }

  override getString(): string {
    return `(comment ${this.index} ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TitleBlockComment)
