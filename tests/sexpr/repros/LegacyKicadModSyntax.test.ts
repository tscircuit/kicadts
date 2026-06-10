import { expect, test } from "bun:test"
import { Footprint, Module, parseKicadMod } from "lib/sexpr"

test("parseKicadMod supports legacy module roots", () => {
  const footprint = parseKicadMod(`
    (module LegacyPart (layer F.Cu) (tedit 5EF32B43)
      (descr "legacy module root")
      (fp_text reference REF** (at 0 0) (layer F.SilkS)
        (effects (font (size 1 1) (thickness 0.15)))
      )
    )
  `)

  expect(footprint).toBeInstanceOf(Footprint)
  expect(footprint).toBeInstanceOf(Module)
  expect(footprint.libraryLink).toBe("LegacyPart")
  expect(footprint.layer?.names).toEqual(["F.Cu"])
  expect(footprint.getString()).toContain("(module")
})

test("legacy module model at children parse as model offsets", () => {
  const footprint = parseKicadMod(`
    (module LegacyPart (layer F.Cu)
      (fp_text reference REF** (at 0 0) (layer F.SilkS)
        (effects (font (size 1 1) (thickness 0.15)))
      )
      (model \${KISYS3DMOD}/Package_DFN_QFN.3dshapes/QFN-56.wrl
        (at (xyz 1 2 3))
        (scale (xyz 1 1 1))
        (rotate (xyz 10 20 30))
      )
    )
  `)

  expect(footprint.models).toHaveLength(1)
  expect(footprint.models[0]?.offset).toEqual({ x: 1, y: 2, z: 3 })
  expect(footprint.models[0]?.scale).toEqual({ x: 1, y: 1, z: 1 })
  expect(footprint.models[0]?.rotate).toEqual({ x: 10, y: 20, z: 30 })
  expect(footprint.models[0]?.getString()).toContain("(offset")
})
