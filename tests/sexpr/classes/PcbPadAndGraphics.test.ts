import { describe, expect, test } from "bun:test"
import {
  Dimension,
  Footprint,
  FootprintPad,
  FpText,
  GrCircle,
  GrLine,
  GrRect,
  PadTenting,
  PadThermalBridgeWidth,
  SxClass,
  Via,
} from "lib/sexpr"

describe("FootprintPad tenting and thermal_bridge_width", () => {
  test("parses and serializes pad tenting front/back and thermal_bridge_width", () => {
    const raw = `(pad "1" smd roundrect
      (at -1.1375 -0.95 180)
      (size 1.325 0.6)
      (layers "F.Cu" "F.Mask" "F.Paste")
      (roundrect_rratio 0.25)
      (net 6 "HDMI_+5V")
      (pinfunction "VOUT")
      (pintype "power_out")
      (thermal_bridge_width 0.2)
      (thermal_bridge_angle 45)
      (thermal_gap 0.001)
      (tenting
        (front none)
        (back none)
      )
      (uuid "dd74e593-27c7-42cc-9918-2a36259c2f73")
    )`

    const [parsed] = SxClass.parse(raw)
    expect(parsed).toBeInstanceOf(FootprintPad)
    const pad = parsed as FootprintPad
    expect(pad.thermalBridgeWidth).toBe(0.2)
    expect(pad.tenting).toBeInstanceOf(PadTenting)
    expect(pad.tenting?.front).toBe("none")
    expect(pad.tenting?.back).toBe("none")

    const output = pad.getString()
    expect(output).toContain("(thermal_bridge_width 0.2)")
    expect(output).toContain("(tenting\n    (front none)\n    (back none)\n  )")

    const [reparsed] = SxClass.parse(output)
    const pad2 = reparsed as FootprintPad
    expect(pad2.thermalBridgeWidth).toBe(0.2)
    expect(pad2.tenting?.front).toBe("none")
    expect(pad2.tenting?.back).toBe("none")
    expect(
      pad.getChildren().some((c) => c instanceof PadThermalBridgeWidth),
    ).toBe(true)
  })

  test("parses Via tenting with nested front/back children", () => {
    const [parsed] = SxClass.parse(`(via
      (at 86.15 56.89)
      (size 0.45)
      (drill 0.3)
      (layers "F.Cu" "B.Cu")
      (free yes)
      (tenting
        (front none)
        (back none)
      )
      (net 1)
      (uuid "019962c8-fa69-44fe-a796-4224e15a3d43")
    )`)

    const via = parsed as Via
    expect(via).toBeInstanceOf(Via)
    expect(via.tenting?.front).toBe("none")
    expect(via.tenting?.back).toBe("none")
    expect(via.getString()).toContain("(front none)")
    expect(via.getString()).toContain("(back none)")
  })
})

describe("GrRect, GrCircle, and GrLine net support", () => {
  test("parses net on gr_rect, gr_circle, and gr_line copper graphics", () => {
    const [rectParsed] = SxClass.parse(`(gr_rect
      (start 129.06 115.97)
      (end 130.36 122.27)
      (stroke (width 0.2) (type solid))
      (fill yes)
      (layer "F.Cu")
      (net 1)
      (uuid "7029f138-5939-48ff-9129-507312cf7b04")
    )`)
    const rect = rectParsed as GrRect
    expect(rect).toBeInstanceOf(GrRect)
    expect(rect.net).toBe(1)
    expect(rect.getString()).toContain("(net 1)")

    const [circleParsed] = SxClass.parse(`(gr_circle
      (center 100 100)
      (end 105 100)
      (stroke (width 0.15) (type solid))
      (fill none)
      (layer "F.Cu")
      (net "GND")
      (uuid "7029f138-5939-48ff-9129-507312cf7b05")
    )`)
    const circle = circleParsed as GrCircle
    expect(circle).toBeInstanceOf(GrCircle)
    expect(circle.net).toBe("GND")
    expect(circle.getString()).toContain('(net "GND")')

    const [lineParsed] = SxClass.parse(`(gr_line
      (start 10 20)
      (end 30 40)
      (stroke (width 0.25) (type default))
      (layer "B.Cu")
      (net 2)
      (uuid "7029f138-5939-48ff-9129-507312cf7b06")
    )`)
    const line = lineParsed as GrLine
    expect(line).toBeInstanceOf(GrLine)
    expect(line.net).toBe(2)
    expect(line.getString()).toContain("(net 2)")
  })
})

describe("Footprint dimension and fp_text render_cache support", () => {
  test("parses footprint with nested dimension and fp_text render_cache", () => {
    const [parsed] = SxClass.parse(`(footprint "Test:FP"
      (layer "F.Cu")
      (at 0 0)
      (fp_text user "TTL"
        (at 0 0 0)
        (layer "F.SilkS")
        (uuid "b69a25e4-f3f7-4a53-9825-ef56a122e182")
        (effects (font (size 1 1) (thickness 0.15)))
        (render_cache "TTL" 0
          (polygon
            (pts
              (xy 0 0) (xy 1 0) (xy 1 1)
            )
          )
        )
      )
      (dimension
        (type aligned)
        (layer "F.Fab")
        (uuid "e99b5ef1-41f8-411f-b7a9-7a0482b6f6a8")
        (pts (xy 0 0) (xy 10 0))
        (height 2)
        (format (prefix "") (suffix "") (units 3) (units_format 1) (precision 2))
        (style
          (thickness 0.15)
          (arrow_length 1.27)
          (text_position_mode 0)
          (extension_height 0.58642)
          (extension_offset 0.5)
          (keep_text_aligned yes)
        )
      )
    )`)

    const fp = parsed as Footprint
    expect(fp).toBeInstanceOf(Footprint)
    expect(fp.dimensions).toHaveLength(1)
    expect(fp.dimensions[0]).toBeInstanceOf(Dimension)
    expect(fp.fpTexts).toHaveLength(1)
    const fpText = fp.fpTexts[0] as FpText
    expect(fpText.renderCache?.text).toBe("TTL")
    expect(fpText.renderCache?.elements).toHaveLength(1)
    expect(fp.getString()).toContain("(dimension")
    expect(fp.getString()).toContain('(render_cache "TTL" 0')
  })
})
