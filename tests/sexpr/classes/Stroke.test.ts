import { Stroke, SxClass } from "lib/sexpr"
import { test, expect } from "bun:test"

test("Stroke", () => {
  const [stroke] = SxClass.parse(
    "(stroke (width 1) (type solid) (color 0 0 0 1))",
  )
  console.log(stroke)
})
