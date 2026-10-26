import { expect, test } from "bun:test"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { parseKicadSch } from "lib/sexpr"
import looksSame from "looks-same"
import { renderSchematic } from "./fixtures/render-schematic"

test("KiCad renders a schematic identically after a kicadts round trip", async () => {
  const baseline = join(import.meta.dir, "__snapshots__/schematic.snap.png")
  const updating =
    Boolean(process.env.BUN_UPDATE_SNAPSHOTS) ||
    process.argv.includes("-u") ||
    process.argv.includes("--update-snapshots")
  if (process.env.CI && (updating || process.env.FORCE_BUN_UPDATE_SNAPSHOTS)) {
    throw new Error("Schematic snapshots must be verified, not updated, in CI.")
  }
  // The existing matcher creates absent snapshots; normal verification must not.
  if (!updating && !existsSync(baseline)) {
    throw new Error(
      "Missing committed schematic snapshot. Regenerate it with BUN_UPDATE_SNAPSHOTS=1 bun run test:schematic-snapshots and review the PNG.",
    )
  }

  const input = await Bun.file(
    join(import.meta.dir, "fixtures/resistor.kicad_sch"),
  ).text()
  const schematic = parseKicadSch(input)
  expect(schematic.symbols).toHaveLength(1)
  expect(schematic.wires).toHaveLength(2)
  const original = await renderSchematic(input)
  const roundTrip = await renderSchematic(schematic.getString())

  expect(roundTrip.width).toBe(1200)
  expect(roundTrip.height).toBeGreaterThan(800)
  // White/blank exports must not become valid snapshots.
  let darkPixels = 0
  const pixels = roundTrip.pixels
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i]! < 128) darkPixels++
  }
  expect(darkPixels).toBeGreaterThan(100)
  expect(darkPixels).toBeLessThan((roundTrip.width * roundTrip.height) / 10)
  expect(pixels.equals(original.pixels)).toBe(true)
  await expect(roundTrip.asPng()).toMatchPngSnapshot(
    import.meta.path,
    "schematic",
  )

  // Prove that a material edit survives serialization and changes the image.
  const value = schematic.symbols[0]!.properties.find(
    (property) => property.key === "Value",
  )
  expect(value).toBeDefined()
  value!.value = "100k"
  const changed = await renderSchematic(schematic.getString())
  expect(
    (await looksSame(roundTrip.asPng(), changed.asPng(), { tolerance: 2 }))
      .equal,
  ).toBe(false)
}, 120_000)
