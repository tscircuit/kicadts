import { expect, test } from "bun:test"
import { KicadSch, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import type { PrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

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

const demoSchematics = [
  "kicad-demos/demos/simulation/rectifier/rectifier.kicad_sch",
  "kicad-demos/demos/simulation/up-down-counter/up-down-c.kicad_sch",
  "kicad-demos/demos/simulation/analog-multiplier/a-multi.kicad_sch",
]

test("kicad_sch round-trips kicad demo schematics", async () => {
  for (const path of demoSchematics) {
    const original = await Bun.file(path).text()
    const classes = SxClass.parse(original)

    expect(classes).toHaveLength(1)
    expect(classes[0]).toBeInstanceOf(KicadSch)

    const roundTrip = classes.map((instance) => instance.getString()).join("\n")

    const originalPrimitive = parseToPrimitiveSExpr(original).map((form) =>
      normalizePrimitive(form),
    )

    const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip).map((form) =>
      normalizePrimitive(form),
    )

    expect({ path, roundTrip: roundTripPrimitive }).toEqual({
      path,
      roundTrip: originalPrimitive,
    })
  }
})
