import { SxClass } from "../../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../../parseToPrimitiveSExpr"

import type { SetupPropertyValues } from "./SetupPropertyTypes"
import { setupPropertyDescriptors } from "./setupPropertyHandlers"

export class Setup extends SxClass implements SetupPropertyValues {
  static override token = "setup"
  static override rawArgs = true
  token = "setup"

  entries: Array<SxClass | PrimitiveSExpr> = []
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (!Array.isArray(arg)) {
        this.entries.push(arg)
        this.extras.push(arg)
        continue
      }

      let parsed: unknown
      try {
        parsed = SxClass.parsePrimitiveSexpr(arg, { parentToken: this.token })
      } catch (error) {
        this.entries.push(arg)
        this.extras.push(arg)
        continue
      }

      if (!(parsed instanceof SxClass)) {
        this.entries.push(arg)
        this.extras.push(arg)
        continue
      }

      this.entries.push(parsed)
      if (this.assignProperty(parsed)) {
        continue
      }
    }
  }

  override getString(): string {
    const lines: string[] = ["(setup"]
    for (const entry of this.entries) {
      if (entry instanceof SxClass) {
        const entryLines = entry.getString().split("\n")
        for (const entryLine of entryLines) {
          lines.push(`  ${entryLine}`)
        }
      } else {
        lines.push(`  ${printSExpr(entry)}`)
      }
    }
    lines.push(")")
    return lines.join("\n")
  }

  private assignProperty(parsed: SxClass): boolean {
    for (const { Class, key } of setupPropertyDescriptors) {
      if (parsed instanceof Class) {
        ;(this as SetupPropertyValues)[key] = parsed as any
        return true
      }
    }
    return false
  }
}
SxClass.register(Setup)

