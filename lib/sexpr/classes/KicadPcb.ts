import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Footprint } from "./Footprint"
import { Image } from "./Image"
import { PcbGeneral } from "./PcbGeneral"
import { PcbGenerator } from "./PcbGenerator"
import { PcbGeneratorVersion } from "./PcbGeneratorVersion"
import { PcbLayers } from "./PcbLayers"
import { PcbNet } from "./PcbNet"
import { PcbVersion } from "./PcbVersion"
import { Paper } from "./Paper"
import { Property } from "./Property"
import { Segment } from "./Segment"
import { GrLine } from "./GrLine"
import { GrText } from "./GrText"
import { Setup } from "./Setup/Setup"
import { TitleBlock } from "./TitleBlock"
import { Via } from "./Via"
import { Zone } from "./Zone"

export class KicadPcb extends SxClass {
  static override token = "kicad_pcb"
  token = "kicad_pcb"

  private _sxVersion?: PcbVersion
  private _sxGenerator?: PcbGenerator
  private _sxGeneratorVersion?: PcbGeneratorVersion
  private _sxGeneral?: PcbGeneral
  private _sxPaper?: Paper
  private _sxTitleBlock?: TitleBlock
  private _sxLayers?: PcbLayers
  private _sxSetup?: Setup
  private _properties: Property[] = []
  private _nets: PcbNet[] = []
  private _footprints: Footprint[] = []
  private _images: Image[] = []
  private _segments: Segment[] = []
  private _grLines: GrLine[] = []
  private _grTexts: GrText[] = []
  private _vias: Via[] = []
  private _zones: Zone[] = []
  private _otherChildren: SxClass[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadPcb {
    const pcb = new KicadPcb()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `kicad_pcb encountered unsupported primitive child: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `kicad_pcb expected SxClass child, received ${JSON.stringify(primitive)}`,
        )
      }

      pcb.consumeChild(parsed)
    }

    return pcb
  }

  private consumeChild(child: SxClass) {
    if (child instanceof PcbVersion) {
      this._sxVersion = child
      return
    }
    if (child instanceof PcbGenerator) {
      this._sxGenerator = child
      return
    }
    if (child instanceof PcbGeneratorVersion) {
      this._sxGeneratorVersion = child
      return
    }
    if (child instanceof PcbGeneral) {
      this._sxGeneral = child
      return
    }
    if (child instanceof Paper) {
      this._sxPaper = child
      return
    }
    if (child instanceof TitleBlock) {
      this._sxTitleBlock = child
      return
    }
    if (child instanceof PcbLayers) {
      this._sxLayers = child
      return
    }
    if (child instanceof Setup) {
      this._sxSetup = child
      return
    }
    if (child instanceof Property) {
      this._properties.push(child)
      return
    }
    if (child instanceof PcbNet) {
      this._nets.push(child)
      return
    }
    if (child instanceof Footprint) {
      this._footprints.push(child)
      return
    }
    if (child instanceof Image) {
      this._images.push(child)
      return
    }
    if (child instanceof Segment) {
      this._segments.push(child)
      return
    }
    if (child instanceof GrLine) {
      this._grLines.push(child)
      return
    }
    if (child instanceof GrText) {
      this._grTexts.push(child)
      return
    }
    if (child instanceof Via) {
      this._vias.push(child)
      return
    }
    if (child instanceof Zone) {
      this._zones.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get version(): number | undefined {
    return this._sxVersion?.value
  }

  set version(value: number | undefined) {
    this._sxVersion = value === undefined ? undefined : new PcbVersion(value)
  }

  get generator(): string | undefined {
    return this._sxGenerator?.value
  }

  set generator(value: string | undefined) {
    this._sxGenerator = value === undefined ? undefined : new PcbGenerator(value)
  }

  get generatorVersion(): string | undefined {
    return this._sxGeneratorVersion?.value
  }

  set generatorVersion(value: string | undefined) {
    this._sxGeneratorVersion =
      value === undefined ? undefined : new PcbGeneratorVersion(value)
  }

  get general(): PcbGeneral | undefined {
    return this._sxGeneral
  }

  set general(value: PcbGeneral | undefined) {
    this._sxGeneral = value
  }

  get paper(): Paper | undefined {
    return this._sxPaper
  }

  set paper(value: Paper | undefined) {
    this._sxPaper = value
  }

  get titleBlock(): TitleBlock | undefined {
    return this._sxTitleBlock
  }

  set titleBlock(value: TitleBlock | undefined) {
    this._sxTitleBlock = value
  }

  get layers(): PcbLayers | undefined {
    return this._sxLayers
  }

  set layers(value: PcbLayers | undefined) {
    this._sxLayers = value
  }

  get setup(): Setup | undefined {
    return this._sxSetup
  }

  set setup(value: Setup | undefined) {
    this._sxSetup = value
  }

  get properties(): Property[] {
    return [...this._properties]
  }

  set properties(value: Property[]) {
    this._properties = [...value]
  }

  get nets(): PcbNet[] {
    return [...this._nets]
  }

  set nets(value: PcbNet[]) {
    this._nets = [...value]
  }

  get footprints(): Footprint[] {
    return [...this._footprints]
  }

  set footprints(value: Footprint[]) {
    this._footprints = [...value]
  }

  get images(): Image[] {
    return [...this._images]
  }

  set images(value: Image[]) {
    this._images = [...value]
  }

  get segments(): Segment[] {
    return [...this._segments]
  }

  set segments(value: Segment[]) {
    this._segments = [...value]
  }

  get graphicLines(): GrLine[] {
    return [...this._grLines]
  }

  set graphicLines(value: GrLine[]) {
    this._grLines = [...value]
  }

  get graphicTexts(): GrText[] {
    return [...this._grTexts]
  }

  set graphicTexts(value: GrText[]) {
    this._grTexts = [...value]
  }

  get vias(): Via[] {
    return [...this._vias]
  }

  set vias(value: Via[]) {
    this._vias = [...value]
  }

  get zones(): Zone[] {
    return [...this._zones]
  }

  set zones(value: Zone[]) {
    this._zones = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxVersion) children.push(this._sxVersion)
    if (this._sxGenerator) children.push(this._sxGenerator)
    if (this._sxGeneratorVersion) children.push(this._sxGeneratorVersion)
    if (this._sxGeneral) children.push(this._sxGeneral)
    if (this._sxPaper) children.push(this._sxPaper)
    if (this._sxTitleBlock) children.push(this._sxTitleBlock)
    if (this._sxLayers) children.push(this._sxLayers)
    if (this._sxSetup) children.push(this._sxSetup)
    children.push(...this._properties)
    children.push(...this._nets)
    children.push(...this._footprints)
    children.push(...this._images)
    children.push(...this._segments)
    children.push(...this._grLines)
    children.push(...this._grTexts)
    children.push(...this._vias)
    children.push(...this._zones)
    children.push(...this._otherChildren)
    return children
  }
}
SxClass.register(KicadPcb)
