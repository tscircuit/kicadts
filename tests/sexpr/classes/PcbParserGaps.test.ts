import {
  Dimension,
  DimensionStyle,
  Footprint,
  FpCurve,
  GrRect,
  GrText,
  Group,
  PadTeardrops,
  PcbArc,
  Setup,
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

test("Setup parses svguseinch plot parameter", () => {
  const [parsed] = SxClass.parse(`
    (setup
      (pcbplotparams
        (svguseinch false)
        (svgprecision 6)
      )
    )
  `)

  const setup = parsed as Setup
  expect(setup).toBeInstanceOf(Setup)
  expect(setup.pcbPlotParams?.svguseinch).toBe("false")
  expect(setup.pcbPlotParams?.svgprecision).toBe(6)
  expect(setup.getString()).toContain("(svguseinch false)")
})

test("GrRect parses tstamp", () => {
  const [parsed] = SxClass.parse(`
    (gr_rect
      (start 0 0)
      (end 1 1)
      (layer "Edge.Cuts")
      (tstamp 00000000-0000-0000-0000-000000000001)
    )
  `)

  const grRect = parsed as GrRect
  expect(grRect).toBeInstanceOf(GrRect)
  expect(grRect.tstamp?.value).toBe("00000000-0000-0000-0000-000000000001")
  expect(grRect.getString()).toContain(
    "(tstamp 00000000-0000-0000-0000-000000000001)",
  )
})

test("PcbArc parses tstamp", () => {
  const parsed = SxClass.parsePrimitiveSexpr(
    [
      "arc",
      ["start", 0, 0],
      ["mid", 1, 1],
      ["end", 2, 0],
      ["width", 0.1],
      ["layer", "Edge.Cuts"],
      ["tstamp", "00000000-0000-0000-0000-000000000001"],
    ],
    { parentToken: "kicad_pcb" },
  )

  const arc = parsed as PcbArc
  expect(arc).toBeInstanceOf(PcbArc)
  expect(arc.tstamp?.value).toBe("00000000-0000-0000-0000-000000000001")
  expect(arc.getString()).toContain(
    "(tstamp 00000000-0000-0000-0000-000000000001)",
  )
})

test("Dimension parses tstamp", () => {
  const parsed = SxClass.parsePrimitiveSexpr(
    [
      "dimension",
      ["type", "aligned"],
      ["layer", "Dwgs.User"],
      ["tstamp", "00000000-0000-0000-0000-000000000001"],
      ["pts", ["xy", 0, 0], ["xy", 1, 0]],
      [
        "style",
        ["thickness", 0.15],
        ["arrow_length", 1.27],
        ["text_position_mode", 0],
      ],
    ],
    { parentToken: "kicad_pcb" },
  )

  const dimension = parsed as Dimension
  expect(dimension).toBeInstanceOf(Dimension)
  expect(dimension.getString()).toContain(
    "(tstamp 00000000-0000-0000-0000-000000000001)",
  )
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
