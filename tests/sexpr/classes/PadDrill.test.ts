import { PadDrill, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("PadDrill setters", () => {
  const drill = new PadDrill({ diameter: 0.5 })
  expect(drill.getString()).toBe("(drill 0.5)")

  drill.oval = true
  drill.width = 0.8
  expect(drill.getString()).toBe("(drill oval 0.5 0.8)")
  expect(drill.rect).toBe(false)

  drill.rect = true
  expect(drill.oval).toBe(false)
  expect(drill.getString()).toBe("(drill rect 0.5 0.8)")

  drill.oval = true
  expect(drill.rect).toBe(false)
  expect(drill.getString()).toBe("(drill oval 0.5 0.8)")
})
