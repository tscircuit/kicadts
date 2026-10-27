import { expect, test } from "bun:test"
import { At, Property, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

test("Property preserves extended attributes", () => {
  const input = `
    (property "Reference" "R1"
      (id 0)
      (at 1 2 90)
      (unlocked yes)
      (show_name yes)
      (do_not_autoplace yes)
      (layer "F.SilkS")
      (hide yes)
      (uuid 12345678-1234-1234-1234-123456789abc)
      (effects
        (font
          (size 1 1)
          (thickness 0.15)
        )
      )
    )
  `

  const [parsed] = SxClass.parse(input)
  expect(parsed).toBeInstanceOf(Property)

  const property = parsed as Property
  expect(property.key).toBe("Reference")
  expect(property.value).toBe("R1")
  expect(property.id).toBe(0)
  const position = property.position
  expect(position).toBeInstanceOf(At)
  if (position instanceof At) {
    expect(position.x).toBe(1)
    expect(position.y).toBe(2)
    expect(position.angle).toBe(90)
  }
  expect(property.unlocked).toBe(true)
  expect(property.showName).toBe(true)
  expect(property.doNotAutoplace).toBe(true)
  expect(property.layer?.names).toEqual(["F.SilkS"])
  expect(property.hidden).toBe(true)
  expect(property.uuid?.value).toBe("12345678-1234-1234-1234-123456789abc")
  expect(property.effects).toBeDefined()

  const roundTrip = property.getString()

  const originalPrimitive = parseToPrimitiveSExpr(input)
  const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip)

  expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive)
})

test("Property can update and remove legacy IDs without changing its value", () => {
  const property = new Property({ key: "Reference", value: "R1", id: 0 })
  expect(property.id).toBe(0)
  property.id = 3
  const [reparsed] = SxClass.parse(property.getString())
  expect((reparsed as Property).id).toBe(3)
  expect((reparsed as Property).value).toBe("R1")
  property.id = undefined
  expect(property.id).toBeUndefined()
  expect(property.getString()).not.toContain("(id ")
})
