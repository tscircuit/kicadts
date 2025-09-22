import {
  Footprint,
  FootprintAttr,
  FootprintPrivateLayers,
  FootprintSolderMaskMargin,
  FpArc,
  FpCircle,
  FpPoly,
  FpRect,
  FpText,
  FpTextBox,
  Layer,
  SxClass,
} from "lib/sexpr"
import { expect, test } from "bun:test"

test("Footprint", () => {
  const [fp] = SxClass.parse(`
    (footprint "Resistor_SMD:R_0603"
      locked
      placed
      (layer F.Cu)
      (tedit 5E4C0E65)
      (uuid 12345678-1234-1234-1234-123456789abc)
      (at 10.16 5.08 90)
      (descr "0603 chip resistor")
      (tags "resistor smd")
      (property "Sheetfile" "example.kicad_sch")
      (path "/abcdef01")
      (autoplace_cost90 4)
      (solder_mask_margin 0.05)
      (attr smd exclude_from_bom)
      (private_layers F.CrtYd B.CrtYd)
      (net_tie_pad_groups "A,B" "C,D")
      (fp_text reference R1 (at 0 0) (layer F.SilkS)
        (effects (font (size 1 1) (thickness 0.15)))
      )
      (fp_text_box locked "Label"
        (start -1 -1)
        (end 1 1)
        (pts (xy -1 -1) (xy 1 -1) (xy 1 1) (xy -1 1))
        (layer F.SilkS)
        (effects (font (size 1.2 1.2) (thickness 0.18)))
        (uuid 99999999-aaaa-bbbb-cccc-dddddddddddd)
      )
      (fp_rect
        (start -2 -2)
        (end 2 2)
        (layer F.Cu)
        (stroke (width 0.1) (type solid) (color 0 0 0 1))
        (uuid 22222222-3333-4444-5555-666666666666)
      )
      (fp_circle locked
        (center 0 0)
        (end 1 0)
        (layer F.SilkS)
        (stroke (width 0.05) (type dash) (color 0.5 0.5 0.5 1))
        (uuid 77777777-8888-9999-aaaa-bbbbbbbbbbbb)
      )
      (fp_arc
        (start -3 0)
        (mid 0 1)
        (end 3 0)
        (layer F.SilkS)
        (stroke (width 0.08) (type solid) (color 0 0 0 1))
        (uuid 44444444-5555-6666-7777-888888888888)
      )
      (fp_poly
        (pts (xy 0 0) (xy 2 0) (xy 2 2) (xy 0 2))
        (layer F.Mask)
        (stroke (width 0.05) (type solid) (color 0 0 0 1))
        (fill yes)
        (uuid 99999999-aaaa-bbbb-cccc-eeeeeeeeeeee)
      )
    )
  `)

  expect(fp).toBeInstanceOf(Footprint)
  const footprint = fp as Footprint

  expect(footprint.libraryLink).toBe("Resistor_SMD:R_0603")
  expect(footprint.locked).toBe(true)
  expect(footprint.placed).toBe(true)
  expect(footprint.layer).toBeInstanceOf(Layer)
  expect(footprint.tedit?.value).toBe("5E4C0E65")
  expect(footprint.uuid?.value).toBe("12345678-1234-1234-1234-123456789abc")
  expect(footprint.position?.x).toBe(10.16)
  expect(footprint.position?.y).toBe(5.08)
  expect(footprint.position?.angle).toBe(90)
  expect(footprint.descr?.value).toBe("0603 chip resistor")
  expect(footprint.tags?.value).toBe("resistor smd")
  expect(footprint.properties[0]?.key).toBe("Sheetfile")
  expect(footprint.properties[0]?.value).toBe("example.kicad_sch")
  expect(footprint.path?.value).toBe("/abcdef01")
  expect(footprint.autoplaceCost90?.value).toBe(4)
  expect(footprint.solderMaskMargin?.value).toBe(0.05)
  expect(footprint.attr).toBeInstanceOf(FootprintAttr)
  expect(footprint.attr?.type).toBe("smd")
  expect(footprint.attr?.excludeFromBom).toBe(true)
  expect(footprint.privateLayers).toBeInstanceOf(FootprintPrivateLayers)
  expect(footprint.privateLayers?.layers).toEqual(["F.CrtYd", "B.CrtYd"])
  expect(footprint.netTiePadGroups?.groups).toEqual(["A,B", "C,D"])
  expect(footprint.fpTexts.length).toBe(1)
  const text = footprint.fpTexts[0] as FpText
  expect(text.type).toBe("reference")
  expect(text.text).toBe("R1")
  expect(text.layer?.names).toEqual(["F.SilkS"])
  expect(text.effects).toBeDefined()
  expect(footprint.fpTextBoxes.length).toBe(1)
  const textBox = footprint.fpTextBoxes[0] as FpTextBox
  expect(textBox.locked).toBe(true)
  expect(textBox.text).toBe("Label")
  expect(textBox.start?.x).toBe(-1)
  expect(textBox.end?.y).toBe(1)
  expect(footprint.fpRects.length).toBe(1)
  const rect = footprint.fpRects[0] as FpRect
  expect(rect.start?.x).toBe(-2)
  expect(rect.end?.y).toBe(2)
  expect(rect.layer?.names).toEqual(["F.Cu"])
  expect(rect.stroke).toBeDefined()
  expect(footprint.fpCircles.length).toBe(1)
  const circle = footprint.fpCircles[0] as FpCircle
  expect(circle.center?.x).toBe(0)
  expect(circle.end?.x).toBe(1)
  expect(footprint.fpArcs.length).toBe(1)
  const arc = footprint.fpArcs[0] as FpArc
  expect(arc.start?.x).toBe(-3)
  expect(arc.mid?.y).toBe(1)
  expect(arc.end?.x).toBe(3)
  expect(footprint.fpPolys.length).toBe(1)
  const poly = footprint.fpPolys[0] as FpPoly
  expect(poly.points?.points.length).toBe(4)
  expect(poly.fill?.filled).toBe(true)
  expect(footprint.extraItems.length).toBe(0)

  footprint.locked = false
  footprint.placed = false
  footprint.solderMaskMargin = new FootprintSolderMaskMargin([0.09])

  expect(footprint.getString()).toMatchInlineSnapshot(`
    "(footprint
      \"Resistor_SMD:R_0603\"
      (layer F.Cu)
      (tedit 5E4C0E65)
      (uuid 12345678-1234-1234-1234-123456789abc)
      (at 10.16 5.08 90)
      (descr \"0603 chip resistor\")
      (tags \"resistor smd\")
      (property \"Sheetfile\" \"example.kicad_sch\")
      (path \"/abcdef01\")
      (autoplace_cost90 4)
      (solder_mask_margin 0.09)
      (attr smd exclude_from_bom)
      (private_layers F.CrtYd B.CrtYd)
      (net_tie_pad_groups \"A,B\" \"C,D\")
      (fp_text
        reference
        \"R1\"
        (at 0 0)
        (layer F.SilkS)
        (effects
          (font
            (size 1 1)
            (thickness 0.15)
          )
        )
      )
      (fp_text_box
        locked
        \"Label\"
        (start -1 -1)
        (end 1 1)
        (pts
          (xy -1 -1)
          (xy 1 -1)
          (xy 1 1)
          (xy -1 1)
        )
        (layer F.SilkS)
        (effects
          (font
            (size 1.2 1.2)
            (thickness 0.18)
          )
        )
        (uuid 99999999-aaaa-bbbb-cccc-dddddddddddd)
      )
      (fp_rect
        (start -2 -2)
        (end 2 2)
        (layer F.Cu)
        (stroke
          (width 0.1)
          (type solid)
          (color 0 0 0 1)
        )
        (uuid 22222222-3333-4444-5555-666666666666)
      )
      (fp_circle
        (center 0 0)
        (end 1 0)
        (layer F.SilkS)
        (stroke
          (width 0.05)
          (type dash)
          (color 0.5 0.5 0.5 1)
        )
        (uuid 77777777-8888-9999-aaaa-bbbbbbbbbbbb)
        locked
      )
      (fp_arc
        (start -3 0)
        (mid 0 1)
        (end 3 0)
        (layer F.SilkS)
        (stroke
          (width 0.08)
          (type solid)
          (color 0 0 0 1)
        )
        (uuid 44444444-5555-6666-7777-888888888888)
      )
      (fp_poly
        (pts
          (xy 0 0)
          (xy 2 0)
          (xy 2 2)
          (xy 0 2)
        )
        (layer F.Mask)
        (stroke
          (width 0.05)
          (type solid)
          (color 0 0 0 1)
        )
        (fill yes)
        (uuid 99999999-aaaa-bbbb-cccc-eeeeeeeeeeee)
      )
    )"
  `)
})
