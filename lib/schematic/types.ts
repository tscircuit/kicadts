import type { GlobalLabel } from "../sexpr/classes/GlobalLabel"
import type { Junction } from "../sexpr/classes/Junction"
import type { Label } from "../sexpr/classes/Label"
import type { SchematicSymbol, SymbolPin } from "../sexpr/classes/Symbol"
import type { Wire } from "../sexpr/classes/Wire"

export interface SchematicConnectivityPoint {
  /** Millimeters in the original sheet coordinate system (Y increases down). */
  x: number
  y: number
}

export interface ResolvedSchematicPin {
  symbol: SchematicSymbol
  /** The pin definition in the embedded library, including its pin number. */
  pin: SymbolPin
  position: SchematicConnectivityPoint
  /** An explicit no-connect marker or a pin with electrical type no_connect. */
  isNoConnect: boolean
}

export interface ResolvedSchematicNet {
  /** Deterministic within this result; not a UUID or KiCad's netlist net code. */
  id: string
  /** Explicit labels and implicit power names. Empty for unnamed nets. */
  names: string[]
  wires: Wire[]
  pins: ResolvedSchematicPin[]
  labels: Array<Label | GlobalLabel>
  junctions: Junction[]
}

export interface SchematicNetResolution {
  /** Includes isolated pins and dangling wires, so callers can inspect them. */
  nets: ResolvedSchematicNet[]
  /** Missing symbol geometry and sheet hierarchy that was not traversed. */
  warnings: string[]
}
