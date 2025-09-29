import { SxClass } from "../../base-classes/SxClass"

import { CoordinateProperty, NumericListProperty } from "./base"

abstract class SetupNumericListProperty extends NumericListProperty {
  static override parentToken = "setup"
}

abstract class SetupCoordinateProperty extends CoordinateProperty {
  static override parentToken = "setup"
}

export class SetupPcbTextSize extends SetupNumericListProperty {
  static override token = "pcb_text_size"
  token = "pcb_text_size"
}
SxClass.register(SetupPcbTextSize)

export class SetupModTextSize extends SetupNumericListProperty {
  static override token = "mod_text_size"
  token = "mod_text_size"
}
SxClass.register(SetupModTextSize)

export class SetupPadSize extends SetupNumericListProperty {
  static override token = "pad_size"
  token = "pad_size"
}
SxClass.register(SetupPadSize)

export class SetupPadToPasteClearanceValues extends SetupNumericListProperty {
  static override token = "pad_to_paste_clearance_values"
  token = "pad_to_paste_clearance_values"
}
SxClass.register(SetupPadToPasteClearanceValues)

export class SetupTraceWidth extends SetupNumericListProperty {
  static override token = "trace_width"
  token = "trace_width"
}
SxClass.register(SetupTraceWidth)

export class SetupAuxAxisOrigin extends SetupCoordinateProperty {
  static override token = "aux_axis_origin"
  token = "aux_axis_origin"
}
SxClass.register(SetupAuxAxisOrigin)

export class SetupGridOrigin extends SetupCoordinateProperty {
  static override token = "grid_origin"
  token = "grid_origin"
}
SxClass.register(SetupGridOrigin)
