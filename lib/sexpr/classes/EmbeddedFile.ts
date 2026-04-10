import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { EmbeddedFileChecksum } from "./EmbeddedFileChecksum"
import { EmbeddedFileData } from "./EmbeddedFileData"
import { EmbeddedFileName } from "./EmbeddedFileName"
import { EmbeddedFileType } from "./EmbeddedFileType"

const SUPPORTED_SINGLE_TOKENS = new Set(["name", "type", "checksum", "data"])

export interface EmbeddedFileConstructorParams {
  name?: string | EmbeddedFileName
  type?: string | EmbeddedFileType
  checksum?: string | EmbeddedFileChecksum
  data?: EmbeddedFileData | string | string[]
}

export class EmbeddedFile extends SxClass {
  static override token = "file"
  static override parentToken = "embedded_files"
  token = "file"

  private _sxName?: EmbeddedFileName
  private _sxType?: EmbeddedFileType
  private _sxChecksum?: EmbeddedFileChecksum
  private _sxData?: EmbeddedFileData

  constructor(params: EmbeddedFileConstructorParams = {}) {
    super()
    if (params.name !== undefined) this.name = params.name
    if (params.type !== undefined) this.type = params.type
    if (params.checksum !== undefined) this.checksum = params.checksum
    if (params.data !== undefined) this.data = params.data
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFile {
    const embeddedFile = new EmbeddedFile()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(`file encountered unsupported child token "${token}"`)
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(`file encountered unsupported child token "${token}"`)
      }
      if (entries.length > 1) {
        throw new Error(`file does not support repeated child token "${token}"`)
      }
    }

    embeddedFile._sxName = propertyMap.name as EmbeddedFileName | undefined
    embeddedFile._sxType = propertyMap.type as EmbeddedFileType | undefined
    embeddedFile._sxChecksum = propertyMap.checksum as
      | EmbeddedFileChecksum
      | undefined
    embeddedFile._sxData = propertyMap.data as EmbeddedFileData | undefined

    return embeddedFile
  }

  get name(): string | undefined {
    return this._sxName?.value
  }

  set name(value: string | EmbeddedFileName | undefined) {
    if (value === undefined) {
      this._sxName = undefined
      return
    }
    this._sxName =
      value instanceof EmbeddedFileName ? value : new EmbeddedFileName(value)
  }

  get type(): string | undefined {
    return this._sxType?.value
  }

  set type(value: string | EmbeddedFileType | undefined) {
    if (value === undefined) {
      this._sxType = undefined
      return
    }
    this._sxType =
      value instanceof EmbeddedFileType ? value : new EmbeddedFileType(value)
  }

  get checksum(): string | undefined {
    return this._sxChecksum?.value
  }

  set checksum(value: string | EmbeddedFileChecksum | undefined) {
    if (value === undefined) {
      this._sxChecksum = undefined
      return
    }
    this._sxChecksum =
      value instanceof EmbeddedFileChecksum
        ? value
        : new EmbeddedFileChecksum(value)
  }

  get data(): EmbeddedFileData | undefined {
    return this._sxData
  }

  set data(value: EmbeddedFileData | string | string[] | undefined) {
    if (value === undefined) {
      this._sxData = undefined
      return
    }
    if (value instanceof EmbeddedFileData) {
      this._sxData = value
      return
    }
    this._sxData = EmbeddedFileData.fromStrings(
      Array.isArray(value) ? value : [value],
    )
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxName) children.push(this._sxName)
    if (this._sxType) children.push(this._sxType)
    if (this._sxChecksum) children.push(this._sxChecksum)
    if (this._sxData) children.push(this._sxData)
    return children
  }
}
SxClass.register(EmbeddedFile)
