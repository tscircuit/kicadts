import { expect, test } from "bun:test"
import { Property, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

test("Property preserves extended attributes", () => {
  const input = `
    (property "Reference" "R1"
      (at 1 2 90)
      (unlocked yes)
      (layer "F.SilkS")
      (hide yes)
      (uuid 12345678-1234-1234-1234-123456789abc)
      (effects
        (font
          (size 1 1)
          (thickness 0.15)
        )
      )
      (extra_token value)
    )
  `

  const [parsed] = SxClass.parse(input)
  expect(parsed).toBeInstanceOf(Property)

  const property = parsed as Property
  expect(property.key).toBe("Reference")
  expect(property.value).toBe("R1")
  expect(property.position?.x).toBe(1)
  expect(property.position?.y).toBe(2)
  expect(property.position?.angle).toBe(90)
  expect(property.unlockedProperty).toBe(true)
  expect(property.layer?.names).toEqual(["F.SilkS"])
  expect(property.hiddenProperty).toBe(true)
  expect(property.uuid?.value).toBe("12345678-1234-1234-1234-123456789abc")
  expect(property.effects).toBeDefined()
  expect(property.unknownChildren.length).toBe(1)

  const roundTrip = property.getString()

  const originalPrimitive = parseToPrimitiveSExpr(input)
  const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip)

  expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive)
})
