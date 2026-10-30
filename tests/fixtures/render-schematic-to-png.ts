import { $ } from "bun"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"

/** Render a schematic with KiCad and crop the PNG to its visible contents. */
export const renderSchematicToPng = async (
  schematic: string,
): Promise<Buffer> => {
  const directory = await mkdtemp(join(tmpdir(), "kicadts-schematic-snapshot-"))
  const input = join(directory, "schematic.kicad_sch")
  const output = join(directory, "svg")
  try {
    await writeFile(input, schematic)
    await $`kicad-cli sch export svg ${input} --output ${output} --theme Modern --exclude-drawing-sheet --no-background-color`.quiet()
    return await sharp(await readFile(join(output, "schematic.svg")), {
      density: 200,
    })
      .flatten({ background: "white" })
      .trim()
      .extend({ top: 24, bottom: 24, left: 24, right: 24, background: "white" })
      .png()
      .toBuffer()
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
