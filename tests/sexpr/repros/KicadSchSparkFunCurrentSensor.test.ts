import { expect, test } from "bun:test"
import { parseKicadSch } from "lib/sexpr"
import {
  parseToPrimitiveSExpr,
  printSExpr,
} from "lib/sexpr/parseToPrimitiveSExpr"
import { renderSchematicToPng } from "../../fixtures/render-schematic-to-png"

const fixturePath =
  "tests/assets/SparkFun_Qwiic_Current_Sensor_INA2XX.kicad_sch"
const snapshotName = "SparkFun_INA2XX-address-table"
const tableSchematic = (table: string) => `(kicad_sch
  (version 20250114)
  (generator "eeschema")
  (uuid "00000000-0000-0000-0000-000000000001")
  (paper "A4")
  (lib_symbols)
  ${table}
)`

test("SparkFun INA2XX address table reference PNG", async () => {
  const [root] = parseToPrimitiveSExpr(await Bun.file(fixturePath).text())
  if (!Array.isArray(root)) throw new Error("Expected schematic expression")
  const table = root.find(
    (child) => Array.isArray(child) && child[0] === "table",
  )
  if (!table) throw new Error("Expected address table")
  await expect(
    renderSchematicToPng(tableSchematic(printSExpr(table))),
  ).toMatchPngSnapshot(import.meta.path, snapshotName)
}, 20_000)

// https://github.com/sparkfun/SparkFun_Qwiic_Current_Sensor_INA2XX/blob/313d3e2c03218f00eb5fb051d5594f05c95abecf/Hardware/SparkFun_Qwiic_Current_Sensor_INA2XX.kicad_sch
test.failing("SparkFun INA2XX schematic parses and round-trips its address table", async () => {
  const original = await Bun.file(fixturePath).text()
  const schematic = parseKicadSch(original)
  const tables = schematic
    .getChildren()
    .filter((child) => child.token === "table")
  expect(tables).toHaveLength(1)
  const table = tables[0]!
  await expect(
    renderSchematicToPng(tableSchematic(table.getString())),
  ).toMatchPngSnapshot(import.meta.path, snapshotName)

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
}, 20_000)
