import "./registerAll"
import { SxClass } from "./base-classes/SxClass"
import { Footprint } from "./classes/Footprint"
import { KicadPcb } from "./classes/KicadPcb"
import { KicadSch } from "./classes/KicadSch"
import { KicadSymbolLib } from "./classes/KicadSymbolLib"

export const parseKicadSexpr = (sexpr: string) => {
  return SxClass.parse(sexpr)
}

export const parseKicadSch = (sexpr: string): KicadSch => {
  const roots = parseKicadSexpr(sexpr)
  if (roots.length !== 1) {
    throw new Error(
      `Expected exactly one top-level expression, got ${roots.length}`,
    )
  }
  const [root] = roots
  if (!(root instanceof KicadSch)) {
    throw new Error(
      `Expected KicadSch root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

export const parseKicadPcb = (sexpr: string): KicadPcb => {
  const roots = parseKicadSexpr(sexpr)
  if (roots.length !== 1) {
    throw new Error(
      `Expected exactly one top-level expression, got ${roots.length}`,
    )
  }
  const [root] = roots
  if (!(root instanceof KicadPcb)) {
    throw new Error(
      `Expected KicadPcb root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

export const parseKicadSym = (sexpr: string): KicadSymbolLib => {
  const roots = parseKicadSexpr(sexpr)
  if (roots.length !== 1) {
    throw new Error(
      `Expected exactly one top-level expression, got ${roots.length}`,
    )
  }
  const [root] = roots
  if (!(root instanceof KicadSymbolLib)) {
    throw new Error(
      `Expected KicadSym root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

export const parseKicadMod = (sexpr: string): Footprint => {
  const roots = parseKicadSexpr(sexpr)
  if (roots.length !== 1) {
    throw new Error(
      `Expected exactly one top-level expression, got ${roots.length}`,
    )
  }
  const [root] = roots
  if (!(root instanceof Footprint)) {
    throw new Error(
      `Expected Footprint root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}
