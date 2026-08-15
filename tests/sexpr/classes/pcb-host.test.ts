import { expect, test } from "bun:test"
import { PcbHost, parseKicadPcb } from "lib/sexpr"

test("PcbHost parses legacy KiCad 5 host metadata", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb
      (version 20171130)
      (host pcbnew "(5.1.9-0-10_14)")
    )
  `)

  expect(pcb.host).toBeInstanceOf(PcbHost)
  expect(pcb.host?.application).toBe("pcbnew")
  expect(pcb.host?.version).toBe("(5.1.9-0-10_14)")
  expect(pcb.otherChildren).toHaveLength(0)
  expect(pcb.getString()).toMatchInlineSnapshot(`
    "(kicad_pcb
      (version 20171130)
      (host pcbnew "(5.1.9-0-10_14)")
    )"
  `)
})
