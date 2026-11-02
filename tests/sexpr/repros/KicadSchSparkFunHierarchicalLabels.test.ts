import { expect, test } from "bun:test"
import { parseKicadSch } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

// Source: https://github.com/sparkfun/SparkFun_Qwiic_WAV_Trigger_Pro/blob/ce8ef7b833609faf070197b642c5425d435c425f/Hardware/usb.kicad_sch
test("SparkFun WAV Trigger Pro USB schematic preserves its hierarchical labels", async () => {
  const source = await Bun.file(
    "tests/assets/SparkFun_Qwiic_WAV_Trigger_Pro-usb.kicad_sch",
  ).text()
  const schematic = parseKicadSch(source)
  const labels = schematic
    .getChildren()
    .filter((child) => child.token === "hierarchical_label")
  expect(labels).toHaveLength(4)

  const [root] = parseToPrimitiveSExpr(source)
  if (!Array.isArray(root)) throw new Error("Expected schematic expression")
  const originalLabels = root.filter(
    (child) => Array.isArray(child) && child[0] === "hierarchical_label",
  )
  const serializedLabels = labels.map(
    (label) => parseToPrimitiveSExpr(label.getString())[0]!,
  )
  expectEqualPrimitiveSExpr(serializedLabels, originalLabels)
  expect(serializedLabels.map((label) => (label as unknown[])[1])).toEqual([
    "USB_FS_DM",
    "USB_FS_DP",
    "VBUS_DET",
    "VBUS_ENA",
  ])

  const reparsedLabels = parseKicadSch(schematic.getString())
    .getChildren()
    .filter((child) => child.token === "hierarchical_label")
  expect(reparsedLabels.map((label) => label.getString())).toEqual(
    labels.map((label) => label.getString()),
  )
})
