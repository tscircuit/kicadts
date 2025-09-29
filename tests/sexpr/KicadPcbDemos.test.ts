import { expect, test } from "bun:test"
import { KicadPcb, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import type { PrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

import { expectEqualPrimitiveSExpr } from "../fixtures/expectEqualPrimitiveSExpr"

const numericLike = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

const normalizePrimitive = (value: PrimitiveSExpr): PrimitiveSExpr => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePrimitive(item))
  }
  if (typeof value === "string" && numericLike.test(value)) {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }
  return value
}

const demoPcbPaths = [
  "kicad-demos/demos/flat_hierarchy/flat_hierarchy.kicad_pcb",
  "kicad-demos/demos/custom_pads_test/custom_pads_test.kicad_pcb",
]

test("kicad_pcb round-trips selected KiCad demo boards", async () => {
  for (const path of demoPcbPaths) {
    const original = await Bun.file(path).text()
    const classes = SxClass.parse(original)

    expect(classes).toHaveLength(1)
    expect(classes[0]).toBeInstanceOf(KicadPcb)

    const roundTrip = classes.map((instance) => instance.getString()).join("\n")

    const originalPrimitive = parseToPrimitiveSExpr(original).map((form) =>
      normalizePrimitive(form),
    )

    const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip).map((form) =>
      normalizePrimitive(form),
    )

    expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive, { path })
  }
})
