import { expect, test } from "bun:test"
import { SxClass, ZoneKeepout } from "lib/sexpr"

test("ZoneKeepout - constructor", () => {
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

  const output = keepout.getString()
  expect(output).toContain("(tracks not_allowed)")
  expect(output).toContain("(vias not_allowed)")
  expect(output).toContain("(pads allowed)")
  expect(output).toContain("(copperpour not_allowed)")
  expect(output).toContain("(footprints allowed)")
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
