import { expect, test } from "bun:test"
import { KicadPcb, SxClass } from "lib/sexpr"
import type { PrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

const numericLike = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

const normalizePrimitive = (value: PrimitiveSExpr): PrimitiveSExpr => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePrimitive(item))
  }

  if (typeof value === "string" && numericLike.test(value)) {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      return Object.is(parsed, -0) ? 0 : parsed
    }
  }

  if (typeof value === "number" && Object.is(value, -0)) {
    return 0
  }

  return value
}

test("kicad_pcb: CM5IO parses dimensions and target markers", async () => {
  const path = "tests/assets/CM5IO.kicad_pcb"
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
})
