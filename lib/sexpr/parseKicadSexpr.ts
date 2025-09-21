import { SxClass } from "./base-classes/SxClass"

export const parseKicadSexpr = (sexpr: string) => {
  return SxClass.parse(sexpr)
}
