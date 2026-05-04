import {
  Footprint,
  FootprintPad,
  FpCircle,
  FpCircleNet,
  FpLineNet,
  FpRect,
  FpRectNet,
  PadZoneLayerConnections,
  SxClass,
} from "lib/sexpr"
import { expect, test } from "bun:test"

test("footprint graphic net children parse and serialize", () => {
  const [footprint] = SxClass.parse(`
    (footprint "Capacitor_SMD:C_0805_2012Metric"
      (fp_line
        (start -0.261252 0.735)
        (end 0.261252 0.735)
        (stroke (width 0.12) (type solid))
        (layer "F.SilkS")
        (net 555017024)
        (uuid "84ac8348-9ada-491a-9705-bbff85b1e094")
      )
    )
  `)

  expect(footprint).toBeInstanceOf(Footprint)
  const fpLine = (footprint as Footprint).fpLines[0]
  expect(fpLine).toBeDefined()
  if (!fpLine) throw new Error("Expected footprint to include an fp_line")
  expect(fpLine.net).toBeInstanceOf(FpLineNet)
  expect(fpLine.net?.id).toBe(555017024)
  expect(fpLine.getString()).toContain("  (net 555017024)")

  const [rect] = SxClass.parse(`
    (fp_rect
      (start -1.88 -0.98)
      (end 1.88 0.98)
      (stroke (width 0.05) (type solid))
      (fill no)
      (layer "F.CrtYd")
      (net 555017024)
      (uuid "73bd1db8-ba4f-43ec-8b32-7403f491362c")
    )
  `)
  expect(rect).toBeInstanceOf(FpRect)
  expect((rect as FpRect).net).toBeInstanceOf(FpRectNet)
  expect((rect as FpRect).getString()).toContain("  (net 555017024)")

  const [circle] = SxClass.parse(`
    (fp_circle
      (center 0 0)
      (end 1 0)
      (stroke (width 0.05) (type solid))
      (fill no)
      (layer "F.CrtYd")
      (net 555017024)
      (uuid "43bd1db8-ba4f-43ec-8b32-7403f491362c")
    )
  `)
  expect(circle).toBeInstanceOf(FpCircle)
  expect((circle as FpCircle).net).toBeInstanceOf(FpCircleNet)
  expect((circle as FpCircle).getString()).toContain("  (net 555017024)")
})

test("pad zone layer connections parses and serializes", () => {
  const [pad] = SxClass.parse(`
    (pad "1" smd roundrect
      (at 0 0)
      (size 1 1)
      (layers F.Cu F.Paste F.Mask)
      (zone_layer_connections)
      (net 1 "GND")
      (uuid "0e946180-87a2-4258-9963-3cf000f6ce7b")
    )
  `)

  expect(pad).toBeInstanceOf(FootprintPad)
  const fpPad = pad as FootprintPad
  expect(fpPad.zoneLayerConnections).toBeInstanceOf(PadZoneLayerConnections)
  expect(fpPad.getString()).toContain("  (zone_layer_connections)")
})
