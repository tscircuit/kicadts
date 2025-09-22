import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { quoteSExprString } from "../utils/quoteSExprString"
import { Paper } from "./Paper"
import { TitleBlock } from "./TitleBlock"
import { Property } from "./Property"
import { Image } from "./Image"
import { Sheet } from "./Sheet"
import { SchematicSymbol } from "./Symbol"
import { Uuid } from "./Uuid"

export class KicadSch extends SxClass {
  static override token = "kicad_sch"
  static override rawArgs = true
  override token = "kicad_sch"

  version?: number
  generator?: string
  uuid?: Uuid
  paper?: Paper
  titleBlock?: TitleBlock
  properties: Property[] = []
  images: Image[] = []
  sheets: Sheet[] = []
  symbols: SchematicSymbol[] = []
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (!Array.isArray(arg) || arg.length === 0) {
        this.extras.push(arg)
        continue
      }

      const [token, ...rest] = arg
      if (typeof token !== "string") {
        this.extras.push(arg)
        continue
      }

      switch (token) {
        case "version": {
          const value = toNumberValue(rest[0])
          if (value !== undefined && rest.length === 1) {
            this.version = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "generator": {
          const value = toStringValue(rest[0])
          if (value !== undefined && rest.length === 1) {
            this.generator = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "uuid": {
          const value = toStringValue(rest[0])
          if (value !== undefined && rest.length === 1) {
            this.uuid = new Uuid([value])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "paper": {
          try {
            this.paper = new Paper(rest as PrimitiveSExpr[])
          } catch (error) {
            this.extras.push(arg)
          }
          break
        }
        case "title_block": {
          const parsed = SxClass.parsePrimitiveSexpr(arg)
          if (parsed instanceof TitleBlock) {
            this.titleBlock = parsed
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "property": {
          const key = toStringValue(rest[0])
          const value = toStringValue(rest[1])
          if (
            key !== undefined &&
            value !== undefined &&
            rest.length === 2
          ) {
            this.properties.push(new Property([key, value]))
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "image": {
          const parsed = SxClass.parsePrimitiveSexpr(arg)
          if (parsed instanceof Image) {
            this.images.push(parsed)
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "sheet": {
          try {
            this.sheets.push(new Sheet(rest as PrimitiveSExpr[]))
          } catch (error) {
            this.extras.push(arg)
          }
          break
        }
        case "symbol": {
          try {
            this.symbols.push(new SchematicSymbol(rest as PrimitiveSExpr[]))
          } catch (error) {
            this.extras.push(arg)
          }
          break
        }
        default:
          this.extras.push(arg)
          break
      }
    }
  }

  override getString(): string {
    const lines: string[] = ["(kicad_sch"]

    const pushLine = (line: string) => {
      lines.push(`  ${line}`)
    }

    const pushClass = (value?: SxClass) => {
      if (!value) return
      const valueLines = value.getString().split("\n")
      for (const valueLine of valueLines) {
        pushLine(valueLine)
      }
    }

    if (this.version !== undefined) {
      pushLine(`(version ${this.version})`)
    }

    if (this.generator !== undefined) {
      pushLine(`(generator ${this.formatGenerator(this.generator)})`)
    }

    pushClass(this.uuid)
    pushClass(this.paper)
    pushClass(this.titleBlock)

    for (const property of this.properties) {
      pushClass(property)
    }

    for (const image of this.images) {
      pushClass(image)
    }

    for (const sheet of this.sheets) {
      pushClass(sheet)
    }

    for (const symbol of this.symbols) {
      pushClass(symbol)
    }

    for (const extra of this.extras) {
      pushLine(printSExpr(extra))
    }

    lines.push(")")
    return lines.join("\n")
  }

  private formatGenerator(value: string): string {
    return /^[A-Za-z0-9._-]+$/.test(value)
      ? value
      : quoteSExprString(value)
  }
}
SxClass.register(KicadSch)
