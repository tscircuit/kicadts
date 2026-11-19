import { expect, test } from "bun:test"
import { parseKicadPcb, Via, ViaTenting } from "lib/sexpr"

test("PCB vias retain per-face tenting overrides when parsed and serialized", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb
      (via (at 1 2) (size 0.6) (drill 0.3) (layers "F.Cu" "B.Cu")
        (tenting (back no) (front yes)))
      (via (at 3 4) (size 0.6) (drill 0.3) (layers "F.Cu" "B.Cu")
        (tenting (back none)))
      (via (at 5 6) (size 0.6) (drill 0.3) (layers "F.Cu" "B.Cu")
        (tenting front back)))
  `)

  for (const board of [pcb, parseKicadPcb(pcb.getString())]) {
    const [overridden, inherited, legacy] = board.vias
    expect(overridden?.tenting?.front).toBe("yes")
    expect(overridden?.tenting?.back).toBe("no")
    expect(inherited?.tenting?.front).toBeUndefined()
    expect(inherited?.tenting?.back).toBe("none")
    expect(legacy?.tenting?.sides).toEqual(["front", "back"])
    expect(legacy?.tenting?.getString()).toBe("(tenting front back)")
  }
})

test("via constructors support explicit overrides and mutable legacy side lists", () => {
  const via = new Via({ tenting: { front: "no", back: "none" } })
  expect(via.tenting?.getString()).toContain("(front no)")
  expect(via.tenting?.getString()).toContain("(back none)")
  via.tenting = ["back"]
  via.tenting?.sides.push("front")
  expect(via.tenting?.getString()).toBe("(tenting back front)")
  expect(new ViaTenting().getString()).toBe("(tenting)")
})

test.each(["(front maybe)", "(back yes no)", "front (back no)", "(left yes)"])(
  "rejects invalid per-face via tenting: %s",
  (overrides) => {
    expect(() =>
      parseKicadPcb(`(kicad_pcb (via (tenting ${overrides})))`),
    ).toThrow()
  },
)
