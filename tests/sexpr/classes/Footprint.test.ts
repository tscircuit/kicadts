import {
  Footprint,
  FootprintAttr,
  FootprintPrivateLayers,
  FootprintSolderMaskMargin,
  FpText,
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
    )"
  `)
})
