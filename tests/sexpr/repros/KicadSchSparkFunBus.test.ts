import { expect, test } from "bun:test"
import { KicadSch, parseKicadSch } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

// https://github.com/sparkfun/SparkFun_IoT_RedBoard-RP2350/blob/46926c417395f6b195cc8077b2b0012884b60475/Hardware/peripherals.kicad_sch#L2762
test("SparkFun RedBoard RP2350 buses and bus entries parse and round-trip", async () => {
  const original = await Bun.file(
    "tests/assets/SparkFun_IoT_RedBoard_RP2350-peripherals.kicad_sch",
  ).text()
  const [root] = parseToPrimitiveSExpr(original)
  if (!Array.isArray(root)) throw new Error("Expected schematic expression")
  const busEntries = root.filter(
    (child) => Array.isArray(child) && child[0] === "bus_entry",
  )
  const buses = root.filter(
    (child) => Array.isArray(child) && child[0] === "bus",
  )
  expect(busEntries).toHaveLength(7)
  expect(buses).toHaveLength(10)
  expect(busEntries[0]).toEqual([
    "bus_entry",
    ["at", 196.85, 139.7],
    ["size", 2.54, -2.54],
    ["stroke", ["width", 0], ["type", "default"]],
    ["uuid", "2e2d888c-c563-4d8f-9556-fadefaa6f5eb"],
  ])
  expect(buses[0]).toEqual([
    "bus",
    ["pts", ["xy", 226.06, 137.16], ["xy", 226.06, 121.92]],
    ["stroke", ["width", 0], ["type", "default"]],
    ["uuid", "042cfed1-fcdd-4591-849e-0e34f0cabc2a"],
  ])

  // Isolate the bus primitives from the unsupported hierarchical labels.
  const schematic = KicadSch.fromSexprPrimitives([...busEntries, ...buses])
  expect(parseToPrimitiveSExpr(schematic.getString())).toEqual([
    ["kicad_sch", ...busEntries, ...buses],
  ])
  const reparsed = parseKicadSch(schematic.getString())
  expect(reparsed.getString()).toBe(schematic.getString())
})
