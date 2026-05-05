import {
  GrArc,
  GrCircle,
  GrCurve,
  GrLine,
  KicadPcb,
  PcbArc,
  SxClass,
} from "lib/sexpr"
import { expect, test } from "bun:test"

const parsePcb = async (path: string): Promise<KicadPcb> => {
  const source = await Bun.file(path).text()
  const [parsed] = SxClass.parse(source)

  expect(parsed).toBeInstanceOf(KicadPcb)
  return parsed as KicadPcb
}

test("KicadPcb parses typed board graphic collections from a real board", async () => {
  const pcb = await parsePcb("tests/assets/corne-keyboard.kicad_pcb")

  expect(pcb.graphicArcs.length).toBeGreaterThan(0)
  expect(pcb.graphicArcs[0]).toBeInstanceOf(GrArc)

  expect(pcb.graphicCircles.length).toBeGreaterThan(0)
  expect(pcb.graphicCircles[0]).toBeInstanceOf(GrCircle)

  expect(pcb.graphicCurves.length).toBeGreaterThan(0)
  expect(pcb.graphicCurves[0]).toBeInstanceOf(GrCurve)

  expect(pcb.graphicLines.length).toBeGreaterThan(0)
  expect(pcb.graphicLines[0]).toBeInstanceOf(GrLine)
})

test("KicadPcb parses typed board copper arcs from a real board", async () => {
  const pcb = await parsePcb("tests/assets/CM5IO.kicad_pcb")

  expect(pcb.arcs.length).toBeGreaterThan(0)
  expect(pcb.arcs[0]).toBeInstanceOf(PcbArc)
})
