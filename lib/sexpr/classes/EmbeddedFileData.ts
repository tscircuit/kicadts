import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class EmbeddedFileData extends SxClass {
  static override token = "data"
  static override parentToken = "file"
  token = "data"

  private _chunks: string[]

  constructor(chunks: string[] = []) {
    super()
    this._chunks = chunks
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFileData {
    const chunks = primitiveSexprs.map((primitive) =>
      primitiveToChunk(primitive),
    )
    return new EmbeddedFileData(chunks)
  }

  static fromStrings(values: string[]): EmbeddedFileData {
    return new EmbeddedFileData(values)
  }

  get chunks(): string[] {
    return [...this._chunks]
  }

  set chunks(values: string[]) {
    this._chunks = [...values]
  }

  get value(): string {
    return this._chunks.join("")
  }

  set value(data: string) {
    this._chunks = [data]
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._chunks.length === 0) {
      return "(data)"
    }
    const rendered = this._chunks.map((chunk) => printSExpr(chunk)).join(" ")
    return `(data ${rendered})`
  }
}
SxClass.register(EmbeddedFileData)

function primitiveToChunk(value: PrimitiveSExpr): string {
  const stringValue = toStringValue(value)
  if (stringValue !== undefined) {
    return stringValue
  }
  return printSExpr(value)
}
