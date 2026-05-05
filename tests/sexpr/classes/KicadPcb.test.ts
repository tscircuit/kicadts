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

test("KicadPcb parses typed board graphics collections", () => {
  const [parsed] = SxClass.parse(`
    (kicad_pcb
      (version 20241229)
      (generator "pcbnew")
      (generator_version "9.0")
      (layers
        (0 "F.Cu" signal)
        (2 "B.Cu" signal)
        (25 "Edge.Cuts" user)
      )
      (gr_arc
        (start 0 0)
        (mid 5 5)
        (end 10 0)
        (stroke
          (width 0.1)
          (type solid)
        )
        (layer "Edge.Cuts")
      )
      (gr_circle
        (center 20 0)
        (end 25 0)
        (stroke
          (width 0.1)
          (type solid)
        )
        (fill no)
        (layer "Edge.Cuts")
      )
      (gr_curve
        (pts
          (xy 30 0)
          (xy 35 5)
          (xy 40 5)
          (xy 45 0)
        )
        (stroke
          (width 0.1)
          (type solid)
        )
        (layer "Edge.Cuts")
      )
      (gr_line
        (start 50 0)
        (end 55 0)
        (stroke
          (width 0.1)
          (type solid)
        )
        (layer "Edge.Cuts")
      )
      (arc
        (start 60 0)
        (mid 65 5)
        (end 70 0)
        (width 0.2)
        (layer "F.Cu")
        (net 1)
      )
    )
  `)

  expect(parsed).toBeInstanceOf(KicadPcb)
  const pcb = parsed as KicadPcb

  expect(pcb.graphicArcs).toHaveLength(1)
  expect(pcb.graphicArcs[0]).toBeInstanceOf(GrArc)

  expect(pcb.graphicCircles).toHaveLength(1)
  expect(pcb.graphicCircles[0]).toBeInstanceOf(GrCircle)

  expect(pcb.graphicCurves).toHaveLength(1)
  expect(pcb.graphicCurves[0]).toBeInstanceOf(GrCurve)

  expect(pcb.graphicLines).toHaveLength(1)
  expect(pcb.graphicLines[0]).toBeInstanceOf(GrLine)

  expect(pcb.arcs).toHaveLength(1)
  expect(pcb.arcs[0]).toBeInstanceOf(PcbArc)

  expect(pcb.otherChildren).toHaveLength(0)
})
