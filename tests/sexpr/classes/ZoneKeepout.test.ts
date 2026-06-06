import { expect, test } from "bun:test"
import { SxClass, ZoneKeepout } from "lib/sexpr"

test("ZoneKeepout - constructor serializes keepout rules", () => {
  const keepout = new ZoneKeepout({
    tracks: "not_allowed",
    vias: "not_allowed",
    pads: "allowed",
    copperpour: "not_allowed",
    footprints: "allowed",
  })

  expect(keepout.tracks).toBe("not_allowed")
  expect(keepout.vias).toBe("not_allowed")
  expect(keepout.pads).toBe("allowed")
  expect(keepout.copperpour).toBe("not_allowed")
  expect(keepout.footprints).toBe("allowed")

  expect(keepout.getString()).toMatchInlineSnapshot(`
    "(keepout
      (tracks not_allowed)
      (vias not_allowed)
      (pads allowed)
      (copperpour not_allowed)
      (footprints allowed)
    )"
  `)
})

test("ZoneKeepout - parses keepout rules", () => {
  const parsed = SxClass.parsePrimitiveSexpr(
    [
      "keepout",
      ["tracks", "allowed"],
      ["vias", "not_allowed"],
      ["pads", "allowed"],
      ["copperpour", "not_allowed"],
      ["footprints", "not_allowed"],
    ],
    { parentToken: "zone" },
  )

  expect(parsed).toBeInstanceOf(ZoneKeepout)
  const keepout = parsed as ZoneKeepout
  expect(keepout.tracks).toBe("allowed")
  expect(keepout.vias).toBe("not_allowed")
  expect(keepout.pads).toBe("allowed")
  expect(keepout.copperpour).toBe("not_allowed")
  expect(keepout.footprints).toBe("not_allowed")
})
