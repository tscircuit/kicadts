import { SxClass } from "../../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { At } from "../At"
import { Layers } from "../Layers"
import { Uuid } from "../Uuid"
import { toNumberValue } from "../../utils/toNumberValue"
import { toStringValue } from "../../utils/toStringValue"
import { quoteSExprString } from "../../utils/quoteSExprString"
import { parseYesNo } from "../../utils/parseYesNo"

interface StyledBoolean {
  value: boolean
  style: "bare" | "sexpr"
}

interface ViaNet {
  id: number
  name?: string
}

export class Via extends SxClass {
  static override token = "via"
  static override rawArgs = true
  token = "via"

  type?: string
  locked?: StyledBoolean
  position?: At
  size?: number
  drill?: number
  layers?: Layers
  removeUnusedLayers?: StyledBoolean
  keepEndLayers?: StyledBoolean
  free?: StyledBoolean
  net?: ViaNet
  uuid?: Uuid
  tstamp?: string
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (typeof arg === "string") {
        if (!this.type && (arg === "blind" || arg === "micro")) {
          this.type = arg
          continue
        }
        if (arg === "locked") {
          this.locked = { value: true, style: "bare" }
          continue
        }
        if (arg === "free") {
          this.free = { value: true, style: "bare" }
          continue
        }
        if (arg === "remove_unused_layers") {
          this.removeUnusedLayers = { value: true, style: "bare" }
          continue
        }
        if (arg === "keep_end_layers") {
          this.keepEndLayers = { value: true, style: "bare" }
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
        case "type": {
          const value = toStringValue(rest[0])
          if (value) {
            this.type = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "locked": {
          const value = parseYesNo(rest[0])
          if (value !== undefined) {
            this.locked = { value, style: "sexpr" }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "free": {
          const value = rest.length === 0 ? true : parseYesNo(rest[0])
          if (value !== undefined) {
            this.free = { value, style: rest.length === 0 ? "bare" : "sexpr" }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "remove_unused_layers": {
          const bool = rest.length === 0 ? true : parseYesNo(rest[0])
          if (bool !== undefined) {
            this.removeUnusedLayers = {
              value: bool,
              style: rest.length === 0 ? "bare" : "sexpr",
            }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "keep_end_layers": {
          const bool = rest.length === 0 ? true : parseYesNo(rest[0])
          if (bool !== undefined) {
            this.keepEndLayers = {
              value: bool,
              style: rest.length === 0 ? "bare" : "sexpr",
            }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "at": {
          const coords = rest.map((value) => Number(value)) as [
            number,
            number,
            number?,
          ]
          this.position = new At(coords)
          break
        }
        case "size": {
          const value = toNumberValue(rest[0])
          if (value !== undefined) {
            this.size = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "drill": {
          const value = toNumberValue(rest[0])
          if (value !== undefined) {
            this.drill = value
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "layers": {
          this.layers = Layers.fromSexprPrimitives(rest as PrimitiveSExpr[])
          break
        }
        case "net": {
          const id = toNumberValue(rest[0])
          if (id !== undefined) {
            const name = toStringValue(rest[1])
            this.net = name ? { id, name } : { id }
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "uuid": {
          const value = toStringValue(rest[0])
          if (value !== undefined) {
            this.uuid = new Uuid([value])
          } else {
            this.extras.push(arg)
          }
          break
        }
        case "tstamp": {
          const value = toStringValue(rest[0])
          if (value !== undefined) {
            this.tstamp = value
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

  override getString(): string {
    const lines = ["(via"]

    const pushLine = (value: string) => {
      lines.push(`  ${value}`)
    }

    const pushClass = (value?: SxClass) => {
      if (!value) return
      const segments = value.getString().split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }

    const pushStyled = (token: string, entry?: StyledBoolean) => {
      if (!entry) return
      if (entry.style === "bare") {
        if (entry.value) {
          pushLine(token)
        }
        return
      }
      pushLine(`(${token} ${entry.value ? "yes" : "no"})`)
    }

    if (this.type) {
      pushLine(this.type)
    }

    if (this.locked?.style === "bare") {
      pushStyled("locked", this.locked)
    }

    if (this.position) {
      pushClass(this.position)
    }

    if (this.size !== undefined) {
      pushLine(`(size ${this.size})`)
    }

    if (this.drill !== undefined) {
      pushLine(`(drill ${this.drill})`)
    }

    if (this.layers) {
      pushClass(this.layers)
    }

    if (this.removeUnusedLayers?.style === "bare") {
      pushStyled("remove_unused_layers", this.removeUnusedLayers)
    }

    if (this.keepEndLayers?.style === "bare") {
      pushStyled("keep_end_layers", this.keepEndLayers)
    }

    if (this.free?.style === "bare") {
      pushStyled("free", this.free)
    }

    if (this.locked && this.locked.style === "sexpr") {
      pushStyled("locked", this.locked)
    }

    if (this.removeUnusedLayers && this.removeUnusedLayers.style === "sexpr") {
      pushStyled("remove_unused_layers", this.removeUnusedLayers)
    }

    if (this.keepEndLayers && this.keepEndLayers.style === "sexpr") {
      pushStyled("keep_end_layers", this.keepEndLayers)
    }

    if (this.free && this.free.style === "sexpr") {
      pushStyled("free", this.free)
    }

    if (this.net) {
      const namePart = this.net.name
        ? ` ${quoteSExprString(this.net.name)}`
        : ""
      pushLine(`(net ${this.net.id}${namePart})`)
    }

    if (this.uuid) {
      pushClass(this.uuid)
    }

    if (this.tstamp) {
      pushLine(`(tstamp ${this.tstamp})`)
    }

    for (const extra of this.extras) {
      pushLine(printSExpr(extra))
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Via)
