import { SxClass } from "../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { Xy } from "./Xy"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

type PropertyEntry =
  | { kind: "position" }
  | { kind: "unlocked" }
  | { kind: "layer" }
  | { kind: "hide" }
  | { kind: "uuid" }
  | { kind: "effects" }
  | { kind: "raw"; value: PrimitiveSExpr }

export class Property extends SxClass {
  static override token = "property"
  static override rawArgs = true
  override token = "property"

  key: string
  value: string

  position?: At | Xy
  unlocked = false
  layer?: Layer
  hidden = false
  uuid?: Uuid
  effects?: TextEffects
  extraArgs: PrimitiveSExpr[] = []

  private entries: PropertyEntry[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    const [keyArg, valueArg, ...rest] = args
    const parsedKey = toStringValue(keyArg)
    const parsedValue = toStringValue(valueArg)

    this.key = parsedKey ?? printSExpr((keyArg ?? "") as PrimitiveSExpr)
    this.value = parsedValue ?? printSExpr((valueArg ?? "") as PrimitiveSExpr)

    for (const arg of rest) {
      if (typeof arg === "string") {
        if (arg === "hide") {
          this.hidden = true
          this.entries.push({ kind: "hide" })
          continue
        }
        this.extraArgs.push(arg)
        this.entries.push({ kind: "raw", value: arg })
        continue
      }

      if (!Array.isArray(arg) || arg.length === 0) {
        this.extraArgs.push(arg)
        this.entries.push({ kind: "raw", value: arg })
        continue
      }

      const [token] = arg
      if (token === "unlocked") {
        const state = toStringValue(arg[1] as PrimitiveSExpr)
        this.unlocked = state === "yes" || state === "true"
        this.entries.push({ kind: "unlocked" })
        continue
      }

      if (token === "hide") {
        const state = toStringValue(arg[1] as PrimitiveSExpr)
        this.hidden = state === "yes" || state === "true"
        this.entries.push({ kind: "hide" })
        continue
      }

      let parsed: unknown
      try {
        parsed = SxClass.parsePrimitiveSexpr(arg)
      } catch (error) {
        this.extraArgs.push(arg)
        this.entries.push({ kind: "raw", value: arg })
        continue
      }

      if (parsed instanceof At || parsed instanceof Xy) {
        this.position = parsed
        this.entries.push({ kind: "position" })
        continue
      }

      if (parsed instanceof Layer) {
        this.layer = parsed
        this.entries.push({ kind: "layer" })
        continue
      }

      if (parsed instanceof Uuid) {
        this.uuid = parsed
        this.entries.push({ kind: "uuid" })
        continue
      }

      if (parsed instanceof TextEffects) {
        this.effects = parsed
        this.entries.push({ kind: "effects" })
        continue
      }

      this.extraArgs.push(arg)
      this.entries.push({ kind: "raw", value: arg })
    }
  }

  get unlockedProperty(): boolean {
    return this.unlocked
  }

  set unlockedProperty(value: boolean) {
    this.unlocked = value
  }

  get hiddenProperty(): boolean {
    return this.hidden
  }

  set hiddenProperty(value: boolean) {
    this.hidden = value
  }

  override getString(): string {
    if (this.entries.length === 0) {
      return `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)})`
    }

    const lines = [
      `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)}`,
    ]

    const pushClass = (cls?: SxClass) => {
      if (!cls) return
      const clsLines = cls.getString().split("\n")
      for (const line of clsLines) {
        lines.push(`  ${line}`)
      }
    }

    const pushRaw = (value: PrimitiveSExpr) => {
      lines.push(`  ${printSExpr(value)}`)
    }

    for (const entry of this.entries) {
      switch (entry.kind) {
        case "position":
          pushClass(this.position)
          break
        case "unlocked":
          if (this.unlocked) {
            lines.push("  (unlocked yes)")
          }
          break
        case "layer":
          pushClass(this.layer)
          break
        case "hide":
          if (this.hidden) {
            lines.push("  (hide yes)")
          }
          break
        case "uuid":
          pushClass(this.uuid)
          break
        case "effects":
          pushClass(this.effects)
          break
        case "raw":
          pushRaw(entry.value)
          break
      }
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Property)
