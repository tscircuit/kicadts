import { expect, test } from "bun:test"
import { SxClass } from "lib/sexpr/base-classes/SxClass"
import { Setup } from "lib/sexpr/classes/Setup/Setup"
import { Via } from "lib/sexpr/classes/Via"

test("parse setup with covering", () => {
  const sexpr = `
(setup
  (covering
    (front yes)
    (back no)
  )
)
  `.trim()

  const classes = SxClass.parse(sexpr)
  expect(classes).toHaveLength(1)
  const setup = classes[0] as Setup
  expect(setup).toBeInstanceOf(Setup)
  expect(setup.covering).toBeDefined()
  expect(setup.covering?.front).toBe(true)
  expect(setup.covering?.back).toBe(false)

  expect(setup.getString()).toContain("(covering")
  expect(setup.getString()).toContain("(front yes)")
  expect(setup.getString()).toContain("(back no)")
})

test("parse via with covering", () => {
  const sexpr = `
(via
  (at 100 100)
  (size 0.8)
  (drill 0.4)
  (layers "F.Cu" "B.Cu")
  (covering
    (front no)
    (back yes)
  )
)
  `.trim()

  const classes = SxClass.parse(sexpr)
  expect(classes).toHaveLength(1)
  const via = classes[0] as Via
  expect(via).toBeInstanceOf(Via)
  expect(via.covering).toBeDefined()
  expect(via.covering?.front).toBe(false)
  expect(via.covering?.back).toBe(true)

  expect(via.getString()).toContain("(covering")
  expect(via.getString()).toContain("(front no)")
  expect(via.getString()).toContain("(back yes)")
})
