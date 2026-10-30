import { expect, test } from "bun:test"
import { KicadSch, parseKicadSch } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

// https://github.com/sparkfun/SparkFun_IoT_RedBoard-RP2350/blob/46926c417395f6b195cc8077b2b0012884b60475/Hardware/peripherals.kicad_sch#L2697
test("SparkFun RedBoard RP2350 bus aliases parse and round-trip", async () => {
  const original = await Bun.file(
    "tests/assets/SparkFun_IoT_RedBoard_RP2350-peripherals.kicad_sch",
  ).text()
  const [root] = parseToPrimitiveSExpr(original)
  if (!Array.isArray(root)) throw new Error("Expected schematic expression")
  const aliases = root.filter(
    (child) => Array.isArray(child) && child[0] === "bus_alias",
  )
  expect(aliases).toHaveLength(1)
  expect(aliases[0]).toEqual([
    "bus_alias",
    "BUTTONS",
    ["members", "~{BOOT}", "~{RESET}", "~{USER_BTN}"],
  ])

  // Isolate the original alias data from the other unsupported bus primitives.
  const schematic = KicadSch.fromSexprPrimitives(aliases)
  const parsedAliases = schematic
    .getChildren()
    .filter((child) => child.token === "bus_alias")
  expect(parsedAliases).toHaveLength(1)
  expect(parseToPrimitiveSExpr(schematic.getString())).toEqual([
    ["kicad_sch", ...aliases],
  ])
  const reparsed = parseKicadSch(schematic.getString())
  const reparsedAliases = reparsed
    .getChildren()
    .filter((child) => child.token === "bus_alias")
  expect(reparsedAliases.map((alias) => alias.getString())).toEqual(
    parsedAliases.map((alias) => alias.getString()),
  )
})
