import { Resvg } from "@resvg/resvg-js"
import { execFile } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
export const SNAPSHOT_KICAD_VERSION = "10.0.6"

/** Render a self-contained, single-sheet schematic with the native KiCad CLI. */
export async function renderSchematic(schematic: string) {
  const directory = await mkdtemp(join(tmpdir(), "kicadts-schematic-"))
  const executable = process.env.KICAD_CLI || "kicad-cli"

  try {
    const configDirectory = join(directory, "config")
    const outputDirectory = join(directory, "svg")
    await mkdir(configDirectory)
    await mkdir(outputDirectory)
    const options = {
      timeout: 30_000,
      maxBuffer: 2 * 1024 * 1024,
      env: {
        ...process.env,
        KICAD_CONFIG_HOME: configDirectory,
        LC_ALL: "C",
      },
    }

    const { stdout: version } = await execFileAsync(
      executable,
      ["--version"],
      options,
    ).catch((error) => {
      throw new Error(
        `Schematic snapshots require KiCad ${SNAPSHOT_KICAD_VERSION}. Set KICAD_CLI to its kicad-cli executable.`,
        { cause: error },
      )
    })
    if (version.trim() !== SNAPSHOT_KICAD_VERSION) {
      throw new Error(
        `Schematic snapshots require KiCad ${SNAPSHOT_KICAD_VERSION}; found ${version.trim()}.`,
      )
    }

    const inputPath = join(directory, "snapshot.kicad_sch")
    await writeFile(inputPath, schematic)
    await execFileAsync(
      executable,
      [
        "sch",
        "export",
        "svg",
        "--output",
        outputDirectory,
        "--black-and-white",
        "--exclude-drawing-sheet",
        "--no-background-color",
        inputPath,
      ],
      options,
    )

    const svg = await readFile(join(outputDirectory, "snapshot.svg"), "utf8")
    return new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      background: "white",
      // The fixture uses KiCad's built-in stroke font, exported as paths.
      font: { loadSystemFonts: false },
    }).render()
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
