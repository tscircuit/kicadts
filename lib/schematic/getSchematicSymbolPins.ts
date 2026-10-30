import type { SchematicSymbol, SymbolPin } from "../sexpr/classes/Symbol"
import type { SchematicConnectivityPoint } from "./types"

export const getSchematicSymbolPins = (
  library: SchematicSymbol,
  instance: SchematicSymbol,
): SymbolPin[] => {
  const unit = instance.unit ?? 1
  const bodyStyle = instance.bodyStyle ?? 1
  const parts = library.subSymbols.filter((part) => {
    const suffix = part.libraryId?.match(/_(\d+)_(\d+)$/)
    if (!suffix) return true
    return (
      (Number(suffix[1]) === 0 || Number(suffix[1]) === unit) &&
      (Number(suffix[2]) === 0 || Number(suffix[2]) === bodyStyle)
    )
  })
  return [library, ...parts].flatMap((part) => part.pins)
}

export const getSchematicPinPosition = (
  symbol: SchematicSymbol,
  pin: SymbolPin,
): SchematicConnectivityPoint => {
  const angle = ((symbol.at?.angle ?? 0) * Math.PI) / 180
  const x = pin.at!.x * Math.cos(angle) - pin.at!.y * Math.sin(angle)
  const y = pin.at!.x * Math.sin(angle) + pin.at!.y * Math.cos(angle)
  // KiCad rotates library geometry before applying the instance mirror.
  // Library Y increases up; sheet Y increases down.
  return {
    x: toNanometerGrid(symbol.at!.x + (symbol.mirror === "y" ? -x : x)),
    y: toNanometerGrid(symbol.at!.y - (symbol.mirror === "x" ? -y : y)),
  }
}

const toNanometerGrid = (value: number): number => Math.round(value * 1e6) / 1e6
