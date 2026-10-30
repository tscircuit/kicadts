import { expect, test } from "bun:test"
import { parseKicadSch } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

// Source: https://github.com/sparkfun/SparkFun_Qwiic_Current_Sensor_INA2XX/blob/313d3e2c03218f00eb5fb051d5594f05c95abecf/Hardware/SparkFun_Qwiic_Current_Sensor_INA2XX.kicad_sch
test.failing("SparkFun INA2XX schematic parses and round-trips its address table", async () => {
  const original = await Bun.file(
    "tests/assets/SparkFun_Qwiic_Current_Sensor_INA2XX.kicad_sch",
  ).text()
  const schematic = parseKicadSch(original)
  const tables = schematic
    .getChildren()
    .filter((child) => child.token === "table")
  expect(tables).toHaveLength(1)
  const table = tables[0]!

  const [root] = parseToPrimitiveSExpr(original)
  if (!Array.isArray(root)) throw new Error("Expected schematic expression")
  const originalTable = root.find(
    (child) => Array.isArray(child) && child[0] === "table",
  )
  expect(parseToPrimitiveSExpr(table.getString())[0]).toEqual(originalTable)

  const reparsed = parseKicadSch(schematic.getString())
  const reparsedTables = reparsed
    .getChildren()
    .filter((child) => child.token === "table")
  expect(reparsedTables.map((child) => child.getString())).toEqual(
    tables.map((child) => child.getString()),
  )
  expect(reparsed.symbols).toHaveLength(schematic.symbols.length)
  expect(reparsed.wires).toHaveLength(schematic.wires.length)
})
