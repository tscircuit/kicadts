import { expect, test } from "bun:test"
import {
  At,
  GlobalLabel,
  type GlobalLabelShape,
  KicadSch,
  SxClass,
  TextEffects,
} from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

test("GlobalLabel parses with all properties", () => {
  const input = `
    (kicad_sch
      (version 20240101)
      (generator test)
      (uuid 00000000-0000-0000-0000-000000000000)
      (global_label "SIGNAL_NAME"
        (shape input)
        (at 100 50 0)
        (effects
          (font
            (size 1.27 1.27)
          )
        )
        (uuid 12345678-1234-1234-1234-123456789abc)
        (fields_autoplaced yes)
        (property "Intersheetrefs" "\${INTERSHEET_REFS}"
          (at 100 50 0)
          (effects
            (font
              (size 1.27 1.27)
            )
          )
        )
      )
    )
  `

  const [parsed] = SxClass.parse(input)
  expect(parsed).toBeInstanceOf(KicadSch)
  const schematic = parsed as KicadSch
  const globalLabels = schematic
    .getChildren()
    .filter((child) => child instanceof GlobalLabel) as GlobalLabel[]
  expect(globalLabels).toHaveLength(1)
  const globalLabel = globalLabels[0]!
  expect(globalLabel).toBeInstanceOf(GlobalLabel)

  expect(globalLabel.value).toBe("SIGNAL_NAME")
  expect(globalLabel.shape).toBe("input")

  const position = globalLabel.at
  expect(position).toBeInstanceOf(At)
  if (position instanceof At) {
    expect(position.x).toBe(100)
    expect(position.y).toBe(50)
    expect(position.angle).toBe(0)
  }

  expect(globalLabel.effects).toBeInstanceOf(TextEffects)
  expect(globalLabel.uuid?.value).toBe("12345678-1234-1234-1234-123456789abc")
  expect(globalLabel.fieldsAutoplaced).toBe(true)
  expect(globalLabel.properties).toHaveLength(1)
  expect(globalLabel.properties[0]?.key).toBe("Intersheetrefs")

  const roundTrip = schematic.getString()

  const originalPrimitive = parseToPrimitiveSExpr(input)
  const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip)

  expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive)
})

test("GlobalLabel supports different shape types", () => {
  const shapes = ["input", "output", "bidirectional", "tri_state", "passive"]

  for (const shape of shapes) {
    const input = `
      (kicad_sch
        (version 20240101)
        (generator test)
        (uuid 00000000-0000-0000-0000-000000000000)
        (global_label "TEST"
          (shape ${shape})
          (at 0 0 0)
          (uuid 12345678-1234-1234-1234-123456789abc)
        )
      )
    `

    const [parsed] = SxClass.parse(input)
    expect(parsed).toBeInstanceOf(KicadSch)
    const schematic = parsed as KicadSch
    const globalLabels = schematic
      .getChildren()
      .filter((child) => child instanceof GlobalLabel) as GlobalLabel[]
    expect(globalLabels).toHaveLength(1)
    const globalLabel = globalLabels[0]!

    expect(globalLabel.shape).toBe(shape as GlobalLabelShape)

    const roundTrip = schematic.getString()
    const originalPrimitive = parseToPrimitiveSExpr(input)
    const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip)
    expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive)
  }
})

test("GlobalLabel can be created programmatically", () => {
  const globalLabel = new GlobalLabel({
    value: "MY_SIGNAL",
    shape: "output",
    at: { x: 50, y: 100, angle: 90 },
    uuid: "abcdef12-3456-7890-abcd-ef1234567890",
    fieldsAutoplaced: true,
  })

  expect(globalLabel.value).toBe("MY_SIGNAL")
  expect(globalLabel.shape).toBe("output")
  expect(globalLabel.at?.x).toBe(50)
  expect(globalLabel.at?.y).toBe(100)
  expect(globalLabel.at?.angle).toBe(90)
  expect(globalLabel.uuid?.value).toBe("abcdef12-3456-7890-abcd-ef1234567890")
  expect(globalLabel.fieldsAutoplaced).toBe(true)

  const output = globalLabel.getString()
  expect(output).toContain("global_label")
  expect(output).toContain("MY_SIGNAL")
  expect(output).toContain("shape output")
})

test("GlobalLabel minimal case", () => {
  const input = `
    (kicad_sch
      (version 20240101)
      (generator test)
      (uuid 00000000-0000-0000-0000-000000000001)
      (global_label "MIN"
        (shape input)
        (at 0 0 0)
        (uuid 00000000-0000-0000-0000-000000000000)
      )
    )
  `

  const [parsed] = SxClass.parse(input)
  expect(parsed).toBeInstanceOf(KicadSch)
  const schematic = parsed as KicadSch
  const globalLabels = schematic
    .getChildren()
    .filter((child) => child instanceof GlobalLabel) as GlobalLabel[]
  expect(globalLabels).toHaveLength(1)
  const globalLabel = globalLabels[0]!

  expect(globalLabel.value).toBe("MIN")
  expect(globalLabel.shape).toBe("input")
  expect(globalLabel.properties).toHaveLength(0)

  const roundTrip = schematic.getString()
  const originalPrimitive = parseToPrimitiveSExpr(input)
  const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip)

  expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive)
})
