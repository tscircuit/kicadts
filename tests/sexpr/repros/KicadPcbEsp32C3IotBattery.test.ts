import { expect, test } from "bun:test"
import { KicadPcb, PcbArc, SxClass, Via } from "lib/sexpr"
import type { PrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

const numericLike = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

const normalizePrimitive = (primitive: PrimitiveSExpr): PrimitiveSExpr => {
  if (Array.isArray(primitive)) {
    if (
      typeof primitive[0] === "string" &&
      ["free", "locked", "remove_unused_layers", "keep_end_layers"].includes(
        primitive[0],
      ) &&
      primitive[1] === "yes"
    ) {
      return [primitive[0]]
    }
    return primitive.map((item) => normalizePrimitive(item))
  }

  if (typeof primitive === "string" && numericLike.test(primitive)) {
    const parsed = Number(primitive)
    if (!Number.isNaN(parsed)) {
      return Object.is(parsed, -0) ? 0 : parsed
    }
  }

  if (typeof primitive === "number" && Object.is(primitive, -0)) {
    return 0
  }

  return primitive
}

test("kicad_pcb: ESP32-C3 IoT battery PCB", async () => {
  const path = "tests/assets/esp32-c3-iot-battery-pcb.kicad_pcb"
  const original = await Bun.file(path).text()
  const classes = SxClass.parse(original)

  expect(classes).toHaveLength(1)
  expect(classes[0]).toBeInstanceOf(KicadPcb)
  const pcb = classes[0] as KicadPcb

  expect(pcb.vias.length).toBeGreaterThan(0)
  expect(pcb.vias[0]).toBeInstanceOf(Via)

  expect(pcb.arcs.length).toBeGreaterThan(0)
  expect(pcb.arcs[0]).toBeInstanceOf(PcbArc)

  const roundTrip = classes.map((instance) => instance.getString()).join("\n")

  const originalPrimitive = parseToPrimitiveSExpr(original).map((form) =>
    normalizePrimitive(form),
  )

  const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip).map((form) =>
    normalizePrimitive(form),
  )

  expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive, { path })
})
