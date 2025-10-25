import { SxClass } from "./base-classes/SxClass"
import { Footprint } from "./classes/Footprint"
import { KicadPcb } from "./classes/KicadPcb"
import { KicadSch } from "./classes/KicadSch"

export const parseKicadSexpr = (sexpr: string) => {
  return SxClass.parse(sexpr)
}

export const parseKicadSch = (sexpr: string): KicadSch => {
  const [root] = parseKicadSexpr(sexpr)
  if (!(root instanceof KicadSch)) {
    throw new Error(
      `Expected KicadSch root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

export const parseKicadPcb = (sexpr: string): KicadPcb => {
  const [root] = parseKicadSexpr(sexpr)
  if (!(root instanceof KicadPcb)) {
    throw new Error(
      `Expected KicadPcb root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

export const parseKicadMod = (sexpr: string): Footprint => {
  const [root] = parseKicadSexpr(sexpr)
  if (!(root instanceof Footprint)) {
    throw new Error(
      `Expected Footprint root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}
