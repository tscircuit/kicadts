import { SxClass } from "../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../parseToPrimitiveSExpr"
import { Paper } from "./Paper"
import { TitleBlock } from "./TitleBlock"
import { Property } from "./Property"
import { Setup } from "./Setup/Setup"
import { Footprint } from "./Footprint"
import { Image } from "./Image"
import { PcbGeneral } from "./PcbGeneral"
import { PcbLayers } from "./PcbLayers"
import { PcbNet } from "./PcbNet"
import { PcbVersion } from "./PcbVersion"
import { PcbGenerator } from "./PcbGenerator"
import { PcbGeneratorVersion } from "./PcbGeneratorVersion"

type BoardEntry = SxClass | PrimitiveSExpr

export class KicadPcb extends SxClass {
  static override token = "kicad_pcb"
  static override rawArgs = true
  override token = "kicad_pcb"

  entries: BoardEntry[] = []

  version?: PcbVersion
  generator?: PcbGenerator
  generatorVersion?: PcbGeneratorVersion
  general?: PcbGeneral
  paper?: Paper
  titleBlock?: TitleBlock
  layers?: PcbLayers
  setup?: Setup
  properties: Property[] = []
  nets: PcbNet[] = []
  footprints: Footprint[] = []
  images: Image[] = []
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (!Array.isArray(arg) || arg.length === 0) {
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

      if (parsed instanceof SxClass) {
        this.entries.push(parsed)
        this.assignClass(parsed)
        continue
      }

      this.entries.push(arg)
      this.extras.push(arg)
    }
  }

  private assignClass(arg: SxClass) {
    if (arg instanceof PcbVersion) {
      this.version = arg
      return
    }
    if (arg instanceof PcbGenerator) {
      this.generator = arg
      return
    }
    if (arg instanceof PcbGeneratorVersion) {
      this.generatorVersion = arg
      return
    }
    if (arg instanceof PcbGeneral) {
      this.general = arg
      return
    }
    if (arg instanceof Paper) {
      this.paper = arg
      return
    }
    if (arg instanceof TitleBlock) {
      this.titleBlock = arg
      return
    }
    if (arg instanceof PcbLayers) {
      this.layers = arg
      return
    }
    if (arg instanceof Setup) {
      this.setup = arg
      return
    }
    if (arg instanceof Property) {
      this.properties.push(arg)
      return
    }
    if (arg instanceof PcbNet) {
      this.nets.push(arg)
      return
    }
    if (arg instanceof Footprint) {
      this.footprints.push(arg)
      return
    }
    if (arg instanceof Image) {
      this.images.push(arg)
      return
    }
    this.extras.push(arg.getString())
  }

  override getString(): string {
    const lines = ["(kicad_pcb"]

    for (const entry of this.entries) {
      if (entry instanceof SxClass) {
        const entryLines = entry.getString().split("\n")
        for (const entryLine of entryLines) {
          lines.push(`  ${entryLine}`)
        }
        continue
      }
      lines.push(`  ${printSExpr(entry)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(KicadPcb)
