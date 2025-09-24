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
  otherClasses: SxClass[] = []
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (!Array.isArray(arg) || arg.length === 0) {
        this.extras.push(arg)
        continue
      }

      let parsed: unknown
      try {
        parsed = SxClass.parsePrimitiveSexpr(arg, { parentToken: this.token })
      } catch (error) {
        this.extras.push(arg)
        continue
      }

      if (parsed instanceof SxClass) {
        if (!this.assignClass(parsed)) {
          this.otherClasses.push(parsed)
        }
        continue
      }

      this.extras.push(arg)
    }
  }

  private assignClass(arg: SxClass): boolean {
    if (arg instanceof PcbVersion) {
      this.version = arg
      return true
    }
    if (arg instanceof PcbGenerator) {
      this.generator = arg
      return true
    }
    if (arg instanceof PcbGeneratorVersion) {
      this.generatorVersion = arg
      return true
    }
    if (arg instanceof PcbGeneral) {
      this.general = arg
      return true
    }
    if (arg instanceof Paper) {
      this.paper = arg
      return true
    }
    if (arg instanceof TitleBlock) {
      this.titleBlock = arg
      return true
    }
    if (arg instanceof PcbLayers) {
      this.layers = arg
      return true
    }
    if (arg instanceof Setup) {
      this.setup = arg
      return true
    }
    if (arg instanceof Property) {
      this.properties.push(arg)
      return true
    }
    if (arg instanceof PcbNet) {
      this.nets.push(arg)
      return true
    }
    if (arg instanceof Footprint) {
      this.footprints.push(arg)
      return true
    }
    if (arg instanceof Image) {
      this.images.push(arg)
      return true
    }
    return false
  }

  private getChildren(): BoardEntry[] {
    const children: BoardEntry[] = []

    if (this.version) children.push(this.version)
    if (this.generator) children.push(this.generator)
    if (this.generatorVersion) children.push(this.generatorVersion)
    if (this.general) children.push(this.general)
    if (this.paper) children.push(this.paper)
    if (this.titleBlock) children.push(this.titleBlock)
    if (this.layers) children.push(this.layers)
    if (this.setup) children.push(this.setup)

    children.push(...this.properties)
    children.push(...this.nets)
    children.push(...this.footprints)
    children.push(...this.images)
    children.push(...this.otherClasses)
    children.push(...this.extras)

    return children
  }

  override getString(): string {
    const lines = ["(kicad_pcb"]

    for (const entry of this.getChildren()) {
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
