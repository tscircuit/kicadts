import { expect, test } from "bun:test"
import { parseKicadPcb, Via } from "lib/sexpr"

// Found while exporting hrithik18k/open-ring-flex. KiCad accepts the via
// type as a bare header token, not a nested `(type blind)` child.
test.each(["blind", "buried", "micro"])(
  "kicad_pcb: serializes %s via type as a bare header token",
  (type) => {
    const via = new Via({
      type,
      at: [100, 100],
      size: 0.2,
      drill: 0.1,
      layers: type === "buried" ? ["In1.Cu", "In2.Cu"] : ["F.Cu", "In1.Cu"],
    })

    expect(via.getString().split("\n")[0]).toBe(`(via ${type}`)
    expect(via.getString()).not.toContain(`(type ${type})`)
  },
)

test("kicad_pcb: preserves bare via types when round-tripping a board", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb
      (version 20241229)
      (generator pcbnew)
      (via blind (at 100 100) (size 0.2) (drill 0.1)
        (layers "F.Cu" "In1.Cu"))
      (via micro (at 102 100) (size 0.2) (drill 0.1)
        (layers "F.Cu" "In1.Cu"))
      (via buried (at 103 100) (size 0.2) (drill 0.1)
        (layers "In1.Cu" "In2.Cu"))
      (via (at 104 100) (size 0.6) (drill 0.3)
        (layers "F.Cu" "B.Cu"))
    )
  `)

  expect(pcb.vias.map((via) => via.type)).toEqual([
    "blind",
    "micro",
    "buried",
    undefined,
  ])
  expect(pcb.vias[2]?.layers?.names).toEqual(["In1.Cu", "In2.Cu"])
  const output = pcb.getString()
  expect(output.match(/\(via blind/g)).toHaveLength(1)
  expect(output.match(/\(via micro/g)).toHaveLength(1)
  expect(output.match(/\(via buried/g)).toHaveLength(1)
  expect(output.match(/\(via\n/g)).toHaveLength(1)
  expect(output).not.toMatch(/\(type (?:blind|buried|micro)\)/)
  expect(parseKicadPcb(output).vias.map((via) => via.type)).toEqual([
    "blind",
    "micro",
    "buried",
    undefined,
  ])
})
