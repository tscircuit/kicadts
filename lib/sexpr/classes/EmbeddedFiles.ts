import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { EmbeddedFile } from "./EmbeddedFile"

export interface EmbeddedFilesConstructorParams {
  files?: EmbeddedFile[]
}

export class EmbeddedFiles extends SxClass {
  static override token = "embedded_files"
  token = "embedded_files"

  private _files: EmbeddedFile[] = []

  constructor(params: EmbeddedFilesConstructorParams = {}) {
    super()
    if (params.files !== undefined) this.files = params.files
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFiles {
    const embeddedFiles = new EmbeddedFiles()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `embedded_files encountered unsupported child: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof EmbeddedFile)) {
        throw new Error(
          `embedded_files expected file child, received ${JSON.stringify(primitive)}`,
        )
      }

      embeddedFiles._files.push(parsed)
    }

    return embeddedFiles
  }

  get files(): EmbeddedFile[] {
    return [...this._files]
  }

  set files(value: EmbeddedFile[]) {
    this._files = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._files]
  }
}
SxClass.register(EmbeddedFiles)
