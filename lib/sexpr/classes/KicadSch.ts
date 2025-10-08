import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Image } from "./Image"
import { KicadSchGenerator } from "./KicadSchGenerator"
import { KicadSchGeneratorVersion } from "./KicadSchGeneratorVersion"
import { KicadSchVersion } from "./KicadSchVersion"
import { LibSymbols } from "./LibSymbols"
import { Paper } from "./Paper"
import { Property } from "./Property"
import { Label } from "./Label"
import { GlobalLabel } from "./GlobalLabel"
import { SchematicSymbol } from "./Symbol"
import { SchematicText } from "./SchematicText"
import { Sheet } from "./Sheet"
import { EmbeddedFonts } from "./EmbeddedFonts"
import { SheetInstances } from "./SheetInstances"
import { TitleBlock } from "./TitleBlock"
import { Uuid } from "./Uuid"
import { Wire } from "./Wire"
import { Junction } from "./Junction"

const SINGLE_CHILD_TOKENS = new Set([
  "version",
  "generator",
  "generator_version",
  "uuid",
  "paper",
  "title_block",
  "lib_symbols",
  "embedded_fonts",
])

const MULTI_CHILD_TOKENS = new Set([
  "property",
  "image",
  "sheet",
  "symbol",
  "text",
  "label",
  "global_label",
  "junction",
  "wire",
  "sheet_instances",
])

const SUPPORTED_CHILD_TOKENS = new Set([
  ...SINGLE_CHILD_TOKENS,
  ...MULTI_CHILD_TOKENS,
])

export interface KicadSchConstructorParams {
  version?: number | KicadSchVersion
  generator?: string | KicadSchGenerator
  generatorVersion?: string | KicadSchGeneratorVersion
  uuid?: string | Uuid
  paper?: Paper
  titleBlock?: TitleBlock
  libSymbols?: LibSymbols
  sheetInstances?: SheetInstances | SheetInstances[]
  embeddedFonts?: EmbeddedFonts
  properties?: Property[]
  images?: Image[]
  sheets?: Sheet[]
  symbols?: SchematicSymbol[]
  texts?: SchematicText[]
  labels?: Label[]
  globalLabels?: GlobalLabel[]
  wires?: Wire[]
  junctions?: Junction[]
}

export class KicadSch extends SxClass {
  static override token = "kicad_sch"
  token = "kicad_sch"

  private _sxVersion?: KicadSchVersion
  private _sxGenerator?: KicadSchGenerator
  private _sxGeneratorVersion?: KicadSchGeneratorVersion
  private _sxUuid?: Uuid
  private _sxPaper?: Paper
  private _sxTitleBlock?: TitleBlock
  private _sxLibSymbols?: LibSymbols
  private _sheetInstances: SheetInstances[] = []
  private _sxEmbeddedFonts?: EmbeddedFonts
  private _properties: Property[] = []
  private _images: Image[] = []
  private _sheets: Sheet[] = []
  private _symbols: SchematicSymbol[] = []
  private _texts: SchematicText[] = []
  private _labels: Label[] = []
  private _globalLabels: GlobalLabel[] = []
  private _wires: Wire[] = []
  private _junctions: Junction[] = []

  constructor(params: KicadSchConstructorParams = {}) {
    super()

    if (params.version instanceof KicadSchVersion) {
      this._sxVersion = params.version
    } else if (params.version !== undefined) {
      this.version = params.version
    }

    if (params.generator instanceof KicadSchGenerator) {
      this._sxGenerator = params.generator
    } else if (params.generator !== undefined) {
      this.generator = params.generator
    }

    if (params.generatorVersion instanceof KicadSchGeneratorVersion) {
      this._sxGeneratorVersion = params.generatorVersion
    } else if (params.generatorVersion !== undefined) {
      this.generatorVersion = params.generatorVersion
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }

    if (params.paper !== undefined) {
      this.paper = params.paper
    }

    if (params.titleBlock !== undefined) {
      this.titleBlock = params.titleBlock
    }

    if (params.libSymbols !== undefined) {
      this.libSymbols = params.libSymbols
    }

    if (params.sheetInstances !== undefined) {
      this.sheetInstances = params.sheetInstances
    }

    if (params.embeddedFonts !== undefined) {
      this.embeddedFonts = params.embeddedFonts
    }

    if (params.properties !== undefined) {
      this.properties = params.properties
    }

    if (params.images !== undefined) {
      this.images = params.images
    }

    if (params.sheets !== undefined) {
      this.sheets = params.sheets
    }

    if (params.symbols !== undefined) {
      this.symbols = params.symbols
    }

    if (params.texts !== undefined) {
      this.texts = params.texts
    }

    if (params.labels !== undefined) {
      this.labels = params.labels
    }

    if (params.globalLabels !== undefined) {
      this.globalLabels = params.globalLabels
    }

    if (params.wires !== undefined) {
      this.wires = params.wires
    }

    if (params.junctions !== undefined) {
      this.junctions = params.junctions
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSch {
    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `kicad_sch encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
        )
      }
      if (primitive.length === 0 || typeof primitive[0] !== "string") {
        throw new Error(
          `kicad_sch encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_CHILD_TOKENS.has(token)) {
        throw new Error(
          `kicad_sch encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_CHILD_TOKENS.has(token)) {
        throw new Error(
          `kicad_sch encountered unsupported child token "${token}"`,
        )
      }
      if (!MULTI_CHILD_TOKENS.has(token) && entries.length > 1) {
        throw new Error(
          `kicad_sch does not support repeated child token "${token}"`,
        )
      }
    }

    return new KicadSch({
      version: propertyMap.version as KicadSchVersion | undefined,
      generator: propertyMap.generator as KicadSchGenerator | undefined,
      generatorVersion: propertyMap.generator_version as
        | KicadSchGeneratorVersion
        | undefined,
      uuid: propertyMap.uuid as Uuid | undefined,
      paper: propertyMap.paper as Paper | undefined,
      titleBlock: propertyMap.title_block as TitleBlock | undefined,
      libSymbols: propertyMap.lib_symbols as LibSymbols | undefined,
      sheetInstances: arrayPropertyMap.sheet_instances as
        | SheetInstances[]
        | undefined,
      embeddedFonts: propertyMap.embedded_fonts as EmbeddedFonts | undefined,
      properties: (arrayPropertyMap.property as Property[]) ?? [],
      images: (arrayPropertyMap.image as Image[]) ?? [],
      sheets: (arrayPropertyMap.sheet as Sheet[]) ?? [],
      symbols: (arrayPropertyMap.symbol as SchematicSymbol[]) ?? [],
      texts: (arrayPropertyMap.text as SchematicText[]) ?? [],
      labels: (arrayPropertyMap.label as Label[]) ?? [],
      globalLabels: (arrayPropertyMap.global_label as GlobalLabel[]) ?? [],
      junctions: (arrayPropertyMap.junction as Junction[]) ?? [],
      wires: (arrayPropertyMap.wire as Wire[]) ?? [],
    })
  }

  get version(): number | undefined {
    return this._sxVersion?.value
  }

  set version(value: number | undefined) {
    this._sxVersion =
      value === undefined ? undefined : new KicadSchVersion(value)
  }

  get generator(): string | undefined {
    return this._sxGenerator?.value
  }

  set generator(value: string | undefined) {
    this._sxGenerator =
      value === undefined ? undefined : new KicadSchGenerator(value)
  }

  get generatorVersion(): string | undefined {
    return this._sxGeneratorVersion?.value
  }

  set generatorVersion(value: string | undefined) {
    this._sxGeneratorVersion =
      value === undefined ? undefined : new KicadSchGeneratorVersion(value)
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
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

  get libSymbols(): LibSymbols | undefined {
    return this._sxLibSymbols
  }

  set libSymbols(value: LibSymbols | undefined) {
    this._sxLibSymbols = value
  }

  get sheetInstances(): SheetInstances[] {
    return [...this._sheetInstances]
  }

  set sheetInstances(value: SheetInstances | SheetInstances[] | undefined) {
    if (value === undefined) {
      this._sheetInstances = []
      return
    }
    this._sheetInstances = Array.isArray(value) ? [...value] : [value]
  }

  get embeddedFonts(): EmbeddedFonts | undefined {
    return this._sxEmbeddedFonts
  }

  set embeddedFonts(value: EmbeddedFonts | undefined) {
    this._sxEmbeddedFonts = value
  }

  get properties(): Property[] {
    return [...this._properties]
  }

  set properties(value: Property[]) {
    this._properties = [...value]
  }

  get images(): Image[] {
    return [...this._images]
  }

  set images(value: Image[]) {
    this._images = [...value]
  }

  get sheets(): Sheet[] {
    return [...this._sheets]
  }

  set sheets(value: Sheet[]) {
    this._sheets = [...value]
  }

  get symbols(): SchematicSymbol[] {
    return [...this._symbols]
  }

  set symbols(value: SchematicSymbol[]) {
    this._symbols = [...value]
  }

  get texts(): SchematicText[] {
    return [...this._texts]
  }

  set texts(value: SchematicText[]) {
    this._texts = [...value]
  }

  get labels(): Label[] {
    return [...this._labels]
  }

  set labels(value: Label[]) {
    this._labels = [...value]
  }

  get globalLabels(): GlobalLabel[] {
    return [...this._globalLabels]
  }

  set globalLabels(value: GlobalLabel[]) {
    this._globalLabels = [...value]
  }

  get junctions(): Junction[] {
    return [...this._junctions]
  }

  set junctions(value: Junction[]) {
    this._junctions = [...value]
  }

  get wires(): Wire[] {
    return [...this._wires]
  }

  set wires(value: Wire[]) {
    this._wires = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxVersion) children.push(this._sxVersion)
    if (this._sxGenerator) children.push(this._sxGenerator)
    if (this._sxGeneratorVersion) children.push(this._sxGeneratorVersion)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxPaper) children.push(this._sxPaper)
    if (this._sxTitleBlock) children.push(this._sxTitleBlock)
    if (this._sxLibSymbols) children.push(this._sxLibSymbols)
    children.push(...this._sheetInstances)
    if (this._sxEmbeddedFonts) children.push(this._sxEmbeddedFonts)
    children.push(...this._properties)
    children.push(...this._images)
    children.push(...this._sheets)
    children.push(...this._symbols)
    children.push(...this._texts)
    children.push(...this._labels)
    children.push(...this._globalLabels)
    children.push(...this._junctions)
    children.push(...this._wires)
    return children
  }
}
SxClass.register(KicadSch)
