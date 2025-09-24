import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

abstract class SetupNumberProperty extends SingleValueProperty<number> {
  static override parentToken = "setup"
}

export class SetupPadToMaskClearance extends SetupNumberProperty {
  static override token = "pad_to_mask_clearance"
  token = "pad_to_mask_clearance"
}
SxClass.register(SetupPadToMaskClearance)

export class SetupSolderMaskMinWidth extends SetupNumberProperty {
  static override token = "solder_mask_min_width"
  token = "solder_mask_min_width"
}
SxClass.register(SetupSolderMaskMinWidth)

export class SetupPadToPasteClearance extends SetupNumberProperty {
  static override token = "pad_to_paste_clearance"
  token = "pad_to_paste_clearance"
}
SxClass.register(SetupPadToPasteClearance)

export class SetupPadToPasteClearanceRatio extends SetupNumberProperty {
  static override token = "pad_to_paste_clearance_ratio"
  token = "pad_to_paste_clearance_ratio"
}
SxClass.register(SetupPadToPasteClearanceRatio)

export class SetupLastTraceWidth extends SetupNumberProperty {
  static override token = "last_trace_width"
  token = "last_trace_width"
}
SxClass.register(SetupLastTraceWidth)

export class SetupTraceClearance extends SetupNumberProperty {
  static override token = "trace_clearance"
  token = "trace_clearance"
}
SxClass.register(SetupTraceClearance)

export class SetupZoneClearance extends SetupNumberProperty {
  static override token = "zone_clearance"
  token = "zone_clearance"
}
SxClass.register(SetupZoneClearance)

export class SetupTraceMin extends SetupNumberProperty {
  static override token = "trace_min"
  token = "trace_min"
}
SxClass.register(SetupTraceMin)

export class SetupSegmentWidth extends SetupNumberProperty {
  static override token = "segment_width"
  token = "segment_width"
}
SxClass.register(SetupSegmentWidth)

export class SetupEdgeWidth extends SetupNumberProperty {
  static override token = "edge_width"
  token = "edge_width"
}
SxClass.register(SetupEdgeWidth)

export class SetupViaSize extends SetupNumberProperty {
  static override token = "via_size"
  token = "via_size"
}
SxClass.register(SetupViaSize)

export class SetupViaDrill extends SetupNumberProperty {
  static override token = "via_drill"
  token = "via_drill"
}
SxClass.register(SetupViaDrill)

export class SetupViaMinSize extends SetupNumberProperty {
  static override token = "via_min_size"
  token = "via_min_size"
}
SxClass.register(SetupViaMinSize)

export class SetupViaMinDrill extends SetupNumberProperty {
  static override token = "via_min_drill"
  token = "via_min_drill"
}
SxClass.register(SetupViaMinDrill)

export class SetupUviaSize extends SetupNumberProperty {
  static override token = "uvia_size"
  token = "uvia_size"
}
SxClass.register(SetupUviaSize)

export class SetupUviaDrill extends SetupNumberProperty {
  static override token = "uvia_drill"
  token = "uvia_drill"
}
SxClass.register(SetupUviaDrill)

export class SetupUviaMinSize extends SetupNumberProperty {
  static override token = "uvia_min_size"
  token = "uvia_min_size"
}
SxClass.register(SetupUviaMinSize)

export class SetupUviaMinDrill extends SetupNumberProperty {
  static override token = "uvia_min_drill"
  token = "uvia_min_drill"
}
SxClass.register(SetupUviaMinDrill)

export class SetupPcbTextWidth extends SetupNumberProperty {
  static override token = "pcb_text_width"
  token = "pcb_text_width"
}
SxClass.register(SetupPcbTextWidth)

export class SetupModEdgeWidth extends SetupNumberProperty {
  static override token = "mod_edge_width"
  token = "mod_edge_width"
}
SxClass.register(SetupModEdgeWidth)

export class SetupModTextWidth extends SetupNumberProperty {
  static override token = "mod_text_width"
  token = "mod_text_width"
}
SxClass.register(SetupModTextWidth)

export class SetupPadDrill extends SetupNumberProperty {
  static override token = "pad_drill"
  token = "pad_drill"
}
SxClass.register(SetupPadDrill)

