import {
  DimensionStyle,
  Footprint,
  FpCurve,
  GrText,
  Group,
  PadTeardrops,
  SxClass,
  ZoneFilledPolygon,
} from "lib/sexpr"
import { expect, test } from "bun:test"

test("Footprint parses nested group", () => {
  const [parsed] = SxClass.parse(`
    (footprint "Test:Grouped"
      (layer "F.Cu")
      (uuid "00000000-0000-0000-0000-000000000001")
      (group ""
        (uuid "00000000-0000-0000-0000-000000000002")
        (members "00000000-0000-0000-0000-000000000003")
      )
    )
  `)

  const footprint = parsed as Footprint
  expect(footprint.groups).toHaveLength(1)
  expect(footprint.groups[0]).toBeInstanceOf(Group)
  expect(footprint.groups[0]?.members).toEqual([
    "00000000-0000-0000-0000-000000000003",
  ])
  expect(footprint.getString()).toContain('(group ""')
})

test("Footprint parses nested fp_curve", () => {
  const [parsed] = SxClass.parse(`
    (footprint "Test:Curve"
      (layer "F.Cu")
      (uuid "00000000-0000-0000-0000-000000000001")
      (fp_curve
        (pts (xy 0 0) (xy 1 0) (xy 1 1) (xy 0 1))
        (stroke (width 0.1) (type solid))
        (layer "F.SilkS")
        (uuid "00000000-0000-0000-0000-000000000002")
      )
    )
  `)

  const footprint = parsed as Footprint
  expect(footprint.fpCurves).toHaveLength(1)
  expect(footprint.fpCurves[0]).toBeInstanceOf(FpCurve)
  expect(footprint.fpCurves[0]?.points?.points).toHaveLength(4)
  expect(footprint.getString()).toContain("(fp_curve")
})

test("PadTeardrops parses curve_points", () => {
  const parsed = SxClass.parsePrimitiveSexpr(
    ["teardrops", ["enabled", "yes"], ["curve_points", 5]],
    { parentToken: "pad" },
  ) as PadTeardrops

  expect(parsed).toBeInstanceOf(PadTeardrops)
  expect(parsed.enabled).toBe(true)
  expect(parsed.curvePoints).toBe(5)
  expect(parsed.getString()).toContain("(curve_points 5)")
})

test("GrText parses locked", () => {
  const [parsed] = SxClass.parse(`
    (gr_text "DDR"
      locked
      (at 0 0)
      (layer "F.SilkS")
      (uuid "00000000-0000-0000-0000-000000000001")
      (effects (font (size 1 1) (thickness 0.15)))
    )
  `)

  const grText = parsed as GrText
  expect(grText.locked).toBe(true)
  expect(grText.getString()).toContain("(locked)")
})

test("DimensionStyle parses bare keep_text_aligned", () => {
  const parsed = SxClass.parsePrimitiveSexpr(
    [
      "style",
      ["thickness", 0.15],
      ["arrow_length", 1.27],
      ["text_position_mode", 0],
      "keep_text_aligned",
    ],
    { parentToken: "dimension" },
  ) as DimensionStyle

  expect(parsed).toBeInstanceOf(DimensionStyle)
  expect(parsed.getString()).toContain("(keep_text_aligned yes)")
})

test("ZoneFilledPolygon parses island", () => {
  const parsed = SxClass.parsePrimitiveSexpr(
    [
      "filled_polygon",
      ["layer", "F.Mask"],
      ["island"],
      ["pts", ["xy", 0, 0], ["xy", 1, 0], ["xy", 1, 1], ["xy", 0, 1]],
    ],
    { parentToken: "zone" },
  ) as ZoneFilledPolygon

  expect(parsed).toBeInstanceOf(ZoneFilledPolygon)
  expect(parsed.island).toBe(true)
  expect(parsed.getString()).toContain("(island)")
})
