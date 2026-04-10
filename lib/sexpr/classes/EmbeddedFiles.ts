import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { EmbeddedFile } from "./EmbeddedFile"

export class EmbeddedFiles extends SxClass {
  static override token = "embedded_files"
  token = "embedded_files"

  files: EmbeddedFile[] = []

  constructor(files: EmbeddedFile[] = []) {
    super()
    this.files = files
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFiles {
    const { arrayPropertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    return new EmbeddedFiles((arrayPropertyMap.file as EmbeddedFile[]) || [])
  }

  override getChildren(): SxClass[] {
    return this.files
  }

  override getString(): string {
    if (this.files.length === 0) return "(embedded_files)"
    return `(embedded_files ${this.files.map((f) => f.getString()).join(" ")})`
  }
}
SxClass.register(EmbeddedFiles)
