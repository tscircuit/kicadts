import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { EmbeddedFileName } from "./EmbeddedFileName"
import { EmbeddedFileType } from "./EmbeddedFileType"
import { EmbeddedFileChecksum } from "./EmbeddedFileChecksum"
import { EmbeddedFileData } from "./EmbeddedFileData"

export class EmbeddedFile extends SxClass {
  static override token = "file"
  static override parentToken = "embedded_files"
  token = "file"

  name?: EmbeddedFileName
  type?: EmbeddedFileType
  checksum?: EmbeddedFileChecksum
  data?: EmbeddedFileData

  constructor(
    params: {
      name?: string | EmbeddedFileName
      type?: string | EmbeddedFileType
      checksum?: string | EmbeddedFileChecksum
      data?: string | EmbeddedFileData
    } = {},
  ) {
    super()
    if (params.name) {
      this.name =
        params.name instanceof EmbeddedFileName
          ? params.name
          : new EmbeddedFileName(params.name)
    }
    if (params.type) {
      this.type =
        params.type instanceof EmbeddedFileType
          ? params.type
          : new EmbeddedFileType(params.type)
    }
    if (params.checksum) {
      this.checksum =
        params.checksum instanceof EmbeddedFileChecksum
          ? params.checksum
          : new EmbeddedFileChecksum(params.checksum)
    }
    if (params.data) {
      this.data =
        params.data instanceof EmbeddedFileData
          ? params.data
          : new EmbeddedFileData([params.data])
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFile {
    const file = new EmbeddedFile()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    file.name = propertyMap.name as EmbeddedFileName | undefined
    file.type = propertyMap.type as EmbeddedFileType | undefined
    file.checksum = propertyMap.checksum as EmbeddedFileChecksum | undefined
    file.data = propertyMap.data as EmbeddedFileData | undefined

    return file
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this.name) children.push(this.name)
    if (this.type) children.push(this.type)
    if (this.checksum) children.push(this.checksum)
    if (this.data) children.push(this.data)
    return children
  }

  override getString(): string {
    return `(file ${this.getChildren()
      .map((c) => c.getString())
      .join(" ")})`
  }
}
SxClass.register(EmbeddedFile)
