import { At, Sheet, SheetProperty, SheetPin, Stroke, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("Sheet", () => {
  const [sheet] = SxClass.parse(`
    (sheet
      (at 25.4 30.48 0)
      (size 100 70)
      fields_autoplaced
      (stroke (width 0.1) (type solid) (color 0 0 0 1))
      (uuid aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee)
      (property "Sheet name" "Controller"
        (id 0)
        (at 0 0 0)
        (effects (font (size 1.27 1.27) (thickness 0.1524)))
      )
      (pin "IN" input (at 50.8 0 180)
        (effects (font (size 1 1) (thickness 0.15)))
        (uuid 11111111-2222-3333-4444-555555555555)
      )
      (instances (project Project (path /0001 (page "1"))))
    )
  `)

  expect(sheet).toBeInstanceOf(Sheet)
  const s = sheet as Sheet
  expect(s.position).toBeInstanceOf(At)
  expect(s.size).toEqual({ width: 100, height: 70 })
  expect(s.fieldsAutoplaced).toBe(true)
  expect(s.stroke).toBeInstanceOf(Stroke)
  expect(s.uuid?.value).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
  expect(s.properties).toHaveLength(1)
  expect(s.properties[0]).toBeInstanceOf(SheetProperty)
  expect(s.pins).toHaveLength(1)
  expect(s.pins[0]).toBeInstanceOf(SheetPin)
  const pin = s.pins[0]
  expect(pin.name).toBe("IN")
  expect(pin.electricalType).toBe("input")
  expect(pin.position).toBeInstanceOf(At)
  expect(pin.effects).toBeDefined()
  expect(s.instances).toBeDefined()

  expect(s.getString()).toMatchInlineSnapshot(`
    "(sheet
      (at 25.4 30.48 0)
      (size 100 70)
      fields_autoplaced
      (stroke
        (width 0.1)
        (type solid)
        (color 0 0 0 1)
      )
      (uuid aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee)
      (property \"Sheet name\" \"Controller\"
        (id 0)
        (at 0 0 0)
        (effects
          (font
            (size 1.27 1.27)
            (thickness 0.1524)
          )
        )
      )
      (pin \"IN\" input
        (at 50.8 0 180)
        (effects
          (font
            (size 1 1)
            (thickness 0.15)
          )
        )
        (uuid 11111111-2222-3333-4444-555555555555)
      )
      (instances
        (project Project (path /0001 (page 1)))
      )
    )"
  `)
})
