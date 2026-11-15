import { expect, test } from "bun:test"
import { Generated } from "../../../lib/sexpr/classes/Generated"

test("Generated preserves string-valued tuning metadata", () => {
  const generated = new Generated()
  generated.rawChildren = [
    ["tuning_mode", "single_track"],
    ["initial_side", "right"],
    ["last_netname", ""],
    ["last_status", "8"],
  ]

  expect(generated.getString()).toMatchInlineSnapshot(`
    "(generated
      (tuning_mode \"single_track\")
      (initial_side \"right\")
      (last_netname \"\")
      (last_status \"8\")
    )"
  `)
})
