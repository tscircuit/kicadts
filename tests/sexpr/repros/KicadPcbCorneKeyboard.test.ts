import { expect, test } from "bun:test"
import { GrArc, GrCircle, GrCurve, GrLine, KicadPcb, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import type { PrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

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

const demoPcbPaths = ["tests/assets/corne-keyboard.kicad_pcb"]

test("kicad_pcb: Corne keyboard", async () => {
  for (const path of demoPcbPaths) {
    const original = await Bun.file(path).text()
    const classes = SxClass.parse(original)

    expect(classes).toHaveLength(1)
    expect(classes[0]).toBeInstanceOf(KicadPcb)
    const pcb = classes[0] as KicadPcb

    expect(pcb.graphicArcs.length).toBeGreaterThan(0)
    expect(pcb.graphicArcs[0]).toBeInstanceOf(GrArc)

    expect(pcb.graphicCircles.length).toBeGreaterThan(0)
    expect(pcb.graphicCircles[0]).toBeInstanceOf(GrCircle)

    expect(pcb.graphicCurves.length).toBeGreaterThan(0)
    expect(pcb.graphicCurves[0]).toBeInstanceOf(GrCurve)

    expect(pcb.graphicLines.length).toBeGreaterThan(0)
    expect(pcb.graphicLines[0]).toBeInstanceOf(GrLine)

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
