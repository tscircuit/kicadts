import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Uuid } from "./Uuid"
import { TextEffects } from "./TextEffects"
import { toStringValue } from "../utils/toStringValue"
import { toNumberValue } from "../utils/toNumberValue"
import { parseYesNo } from "../utils/parseYesNo"
import { indentLines } from "../utils/indentLines"

export class Symbol extends SxClass {
  static override token = "symbol"
  static override rawArgs = true
  token = "symbol"

  libraryIdentifier: string
  position?: At
  unit?: number
  inBom?: boolean
  onBoard?: boolean
  uuid?: Uuid
  properties: SymbolProperty[] = []
  pins: SymbolPin[] = []
  instances?: SymbolInstances
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()
    if (args.length === 0 || typeof args[0] !== "string") {
      throw new Error("symbol must start with a library identifier string")
    }
    this.libraryIdentifier = args[0]

    for (const arg of args.slice(1)) {
      if (typeof arg === "string") {
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
        case "unit": {
          const num = toNumberValue(rest[0])
          if (num !== undefined) {
            this.unit = num
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "in_bom": {
          const bool = parseYesNo(rest[0])
          if (bool !== undefined) {
            this.inBom = bool
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "on_board": {
          const bool = parseYesNo(rest[0])
          if (bool !== undefined) {
            this.onBoard = bool
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
          this.properties.push(new SymbolProperty(rest as PrimitiveSExpr[]))
          break
        }
        case "pin": {
          this.pins.push(new SymbolPin(rest as PrimitiveSExpr[]))
          break
        }
        case "instances": {
          this.instances = new SymbolInstances(rest as PrimitiveSExpr[])
          break
        }
        default:
          this.extras.push(arg)
          break
      }
    }
  }

  override getString(): string {
    const lines = [`(symbol ${quoteSExprString(this.libraryIdentifier)}`]

    const pushLines = (value?: string | string[]) => {
      if (!value) return
      const push = (line: string) => {
        const parts = line.split("\n")
        for (const part of parts) {
          lines.push(`  ${part}`)
        }
      }
      if (Array.isArray(value)) {
        for (const line of value) push(line)
      } else {
        push(value)
      }
    }

    if (this.position) pushLines(this.position.getString())
    if (this.unit !== undefined) pushLines(`(unit ${this.unit})`)
    if (this.inBom !== undefined) pushLines(`(in_bom ${this.inBom ? "yes" : "no"})`)
    if (this.onBoard !== undefined) pushLines(`(on_board ${this.onBoard ? "yes" : "no"})`)
    if (this.uuid) pushLines(this.uuid.getString())

    for (const property of this.properties) {
      pushLines(property.getStringLines())
    }

    for (const pin of this.pins) {
      pushLines(pin.getString())
    }

    if (this.instances) pushLines(this.instances.getStringLines())

    for (const extra of this.extras) {
      pushLines(printSExpr(extra))
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Symbol)

export class SymbolProperty extends SxClass {
  static override token = "property"
  static override parentToken = "symbol"
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
      throw new Error("symbol property requires a key and value")
    }

    const key = toStringValue(args[0])
    const value = toStringValue(args[1])
    if (!key || value === undefined) {
      throw new Error("symbol property key/value must be strings")
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
    const lines: string[] = [
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
SxClass.register(SymbolProperty)

export class SymbolPin extends SxClass {
  static override token = "pin"
  static override parentToken = "symbol"
  static override rawArgs = true
  token = "pin"

  name?: string
  uuid?: Uuid
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.name = toStringValue(args[0])

    for (const arg of args.slice(this.name ? 1 : 0)) {
      if (!Array.isArray(arg) || arg.length === 0) {
        this.extras.push(arg)
        continue
      }

      const [token, ...rest] = arg
      if (token === "uuid") {
        this.uuid = new Uuid(rest as [string])
      } else {
        this.extras.push(arg)
      }
    }
  }

  override getString(): string {
    const header = this.name !== undefined
      ? `(pin ${quoteSExprString(this.name)}`
      : "(pin"

    const body: string[] = []
    if (this.uuid) {
      body.push(this.uuid.getString())
    }
    for (const extra of this.extras) {
      body.push(printSExpr(extra))
    }

    if (body.length === 0) {
      return `${header})`
    }

    const lines = [header]
    for (const segment of body) {
      lines.push(`  ${segment}`)
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolPin)

export class SymbolInstances extends SxClass {
  static override token = "instances"
  static override parentToken = "symbol"
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
      for (const line of indentLines(printSExpr(entry))) {
        lines.push(line)
      }
    }
    lines.push(")")
    return lines
  }
}
SxClass.register(SymbolInstances)
