import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class GeneratedSimpleField extends SxClass {
  static override token = ""
  static override parentToken = "generated"
  override token = ""

  value: string | number | boolean

  constructor(token: string, value: string | number | boolean) {
    super()
    this.token = token
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GeneratedSimpleField {
    // This method will be used by the subclasses
    const val = toStringValue(primitiveSexprs[0])
    if (val === undefined) {
      throw new Error(`generated field expects a value`)
    }
    // We don't know the token here because this is the base class,
    // but the subclass will override it or we'll handle it during registration.
    return new GeneratedSimpleField("", val)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const valStr =
      typeof this.value === "string"
        ? quoteSExprString(this.value)
        : String(this.value)
    return `(${this.token} ${valStr})`
  }
}

export function registerGeneratedSimpleField(token: string) {
  const Cls = class extends GeneratedSimpleField {
    static override token = token
    static override parentToken = "generated"
    override token = token

    constructor(value: string | number | boolean) {
      super(token, value)
    }

    static override fromSexprPrimitives(
      primitiveSexprs: PrimitiveSExpr[],
    ): any {
      const val = toStringValue(primitiveSexprs[0])
      if (val === undefined) {
        throw new Error(`generated field ${token} expects a value`)
      }
      // Try to parse as number if it looks like one
      const num = Number(val)
      if (!isNaN(num) && val.trim() !== "") {
        return new Cls(num)
      }
      return new Cls(val)
    }
  }
  SxClass.register(Cls)
  return Cls
}

// Register all the simple fields
export const GeneratedCornerRadiusPercent = registerGeneratedSimpleField(
  "corner_radius_percent",
)
export const GeneratedInitialSide = registerGeneratedSimpleField("initial_side")
export const GeneratedLastDiffPairGap =
  registerGeneratedSimpleField("last_diff_pair_gap")
export const GeneratedLastNetname = registerGeneratedSimpleField("last_netname")
export const GeneratedLastStatus = registerGeneratedSimpleField("last_status")
export const GeneratedLastTrackWidth =
  registerGeneratedSimpleField("last_track_width")
export const GeneratedLastTuning = registerGeneratedSimpleField("last_tuning")
export const GeneratedMaxAmplitude =
  registerGeneratedSimpleField("max_amplitude")
export const GeneratedMinAmplitude =
  registerGeneratedSimpleField("min_amplitude")
export const GeneratedMinSpacing = registerGeneratedSimpleField("min_spacing")
export const GeneratedOverrideCustomRules = registerGeneratedSimpleField(
  "override_custom_rules",
)
export const GeneratedRounded = registerGeneratedSimpleField("rounded")
export const GeneratedSingleSided = registerGeneratedSimpleField("single_sided")
export const GeneratedTargetLength =
  registerGeneratedSimpleField("target_length")
export const GeneratedTargetLengthMax =
  registerGeneratedSimpleField("target_length_max")
export const GeneratedTargetLengthMin =
  registerGeneratedSimpleField("target_length_min")
export const GeneratedTargetSkew = registerGeneratedSimpleField("target_skew")
export const GeneratedTargetSkewMax =
  registerGeneratedSimpleField("target_skew_max")
export const GeneratedTargetSkewMin =
  registerGeneratedSimpleField("target_skew_min")
export const GeneratedTuningMode = registerGeneratedSimpleField("tuning_mode")
