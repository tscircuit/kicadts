import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"
import { toNumberValue } from "../utils/toNumberValue"
import { parseYesNo } from "../utils/parseYesNo"
import { indentLines } from "../utils/indentLines"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { At } from "./At"
import { Uuid } from "./Uuid"
import { Stroke } from "./Stroke"
import { TextEffects } from "./TextEffects"

export class Sheet extends SxClass {
  static override token = "sheet"
  static override rawArgs = true
  token = "sheet"

  position?: At
  size?: { width: number; height: number }
  fieldsAutoplaced = false
  stroke?: Stroke
  uuid?: Uuid
  properties: SheetProperty[] = []
  pins: SheetPin[] = []
  instances?: SheetInstances
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (typeof arg === "string") {
        if (arg === "fields_autoplaced") {
          this.fieldsAutoplaced = true
          continue
        }
        this.extras.push(arg)
        continue
      }

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
        case "at": {
          const coords = rest
            .map((value) => toNumberValue(value))
            .filter((value): value is number => value !== undefined)
          if (coords.length >= 2) {
            this.position = new At(coords as [number, number, number?])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "size": {
          const width = toNumberValue(rest[0])
          const height = toNumberValue(rest[1])
          if (width !== undefined && height !== undefined) {
            this.size = { width, height }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "stroke": {
          const stroke = strokeFromArgs(rest as PrimitiveSExpr[])
          if (stroke) {
            this.stroke = stroke
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "uuid": {
          this.uuid = new Uuid(rest as [string])
          break
        }
        case "property": {
          this.properties.push(new SheetProperty(rest as PrimitiveSExpr[]))
          break
        }
        case "pin": {
          this.pins.push(new SheetPin(rest as PrimitiveSExpr[]))
          break
        }
        case "instances": {
          this.instances = new SheetInstances(rest as PrimitiveSExpr[])
          break
        }
        default:
          this.extras.push(arg)
          break
      }
    }
  }

  override getString(): string {
    const lines = ["(sheet"]

    const push = (value?: string | string[]) => {
      if (!value) return
      const pushLine = (line: string) => {
        for (const segment of line.split("\n")) {
          lines.push(`  ${segment}`)
        }
      }
      if (Array.isArray(value)) {
        for (const line of value) pushLine(line)
      } else {
        pushLine(value)
      }
    }

    if (this.position) push(this.position.getString())
    if (this.size) push(`(size ${this.size.width} ${this.size.height})`)
    if (this.fieldsAutoplaced) push("fields_autoplaced")
    if (this.stroke) push(this.stroke.getString())
    if (this.uuid) push(this.uuid.getString())

    for (const property of this.properties) {
      push(property.getStringLines())
    }

    for (const pin of this.pins) {
      push(pin.getString())
    }

    if (this.instances) push(this.instances.getStringLines())

    for (const extra of this.extras) {
      push(printSExpr(extra))
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Sheet)

export class SheetProperty extends SxClass {
  static override token = "property"
  static override parentToken = "sheet"
  static override rawArgs = true
  token = "property"

  key: string
  value: string
  id?: number
  at?: At
  effects?: TextEffects
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()
    if (args.length < 2) {
      throw new Error("sheet property requires key and value")
    }

    const key = toStringValue(args[0])
    const value = toStringValue(args[1])
    if (!key || value === undefined) {
      throw new Error("sheet property key/value must be strings")
    }
    this.key = key
    this.value = value

    for (const arg of args.slice(2)) {
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
        case "id": {
          const num = toNumberValue(rest[0])
          if (num !== undefined) {
            this.id = num
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "at": {
          const coords = rest
            .map((value) => toNumberValue(value))
            .filter((value): value is number => value !== undefined)
          if (coords.length >= 2) {
            this.at = new At(coords as [number, number, number?])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "effects": {
          const parsed = SxClass.parsePrimitiveSexpr([
            "effects",
            ...rest,
          ] as PrimitiveSExpr)
          if (parsed instanceof TextEffects) {
            this.effects = parsed
          } else {
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

  getStringLines(): string[] {
    const lines = [
      `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)}`,
    ]
    if (this.id !== undefined) {
      lines.push(`  (id ${this.id})`)
    }
    if (this.at) {
      lines.push(`  ${this.at.getString()}`)
    }
    if (this.effects) {
      lines.push(...indentLines(this.effects.getString()))
    }
    for (const extra of this.extras) {
      lines.push(`  ${printSExpr(extra)}`)
    }
    lines.push(")")
    return lines
  }
}
SxClass.register(SheetProperty)

export class SheetPin extends SxClass {
  static override token = "pin"
  static override parentToken = "sheet"
  static override rawArgs = true
  token = "pin"

  name?: string
  raw: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.raw = args
    this.name = toStringValue(args[0])
  }

  override getString(): string {
    const inlineParts: string[] = []
    const blockParts: string[] = []

    const firstIndex = this.name !== undefined ? 1 : 0
    if (this.raw.length > firstIndex) {
      for (let i = firstIndex; i < this.raw.length; i++) {
        const part = this.raw[i]
        if (Array.isArray(part)) {
          blockParts.push(printSExpr(part))
        } else {
          inlineParts.push(printSExpr(part))
        }
      }
    }

    let header = "(pin"
    if (this.name !== undefined) {
      header += ` ${quoteSExprString(this.name)}`
    }
    if (inlineParts.length) {
      header += ` ${inlineParts.join(" ")}`
    }

    if (blockParts.length === 0) {
      return `${header})`
    }

    const lines = [header]
    for (const block of blockParts) {
      lines.push(...indentLines(block))
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SheetPin)

export class SheetInstances extends SxClass {
  static override token = "instances"
  static override parentToken = "sheet"
  static override rawArgs = true
  token = "instances"

  raw: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.raw = args
  }

  getStringLines(): string[] {
    const lines = ["(instances"]
    for (const entry of this.raw) {
      lines.push(...indentLines(printSExpr(entry)))
    }
    lines.push(")")
    return lines
  }
}
SxClass.register(SheetInstances)
