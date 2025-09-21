// s_expr_parser.ts
export type PrimitiveSExpr =
  | string // symbols and string literals (distinct via `type` guard if you want)
  | number
  | boolean
  | null
  | PrimitiveSExpr[] // lists

type Token =
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "nil" }
  | { type: "symbol"; value: string }

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  const isWhitespace = (ch: string) => /\s/.test(ch)
  const isSymbolInitial = (ch: string) => /[^\s()"]/u.test(ch) // anything except ws, parens, quote
  const peek = () => input[i]
  const advance = () => input[i++]

  while (i < input.length) {
    const ch = peek()

    // Skip whitespace
    if (isWhitespace(ch)) {
      i++
      continue
    }

    // Comments ;...<EOL>
    if (ch === ";") {
      while (i < input.length && input[i] !== "\n") i++
      continue
    }

    if (ch === "(") {
      tokens.push({ type: "lparen" })
      i++
      continue
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" })
      i++
      continue
    }

    // String literal
    if (ch === '"') {
      i++ // skip opening quote
      let out = ""
      while (i < input.length) {
        const c = advance()
        if (c === '"') break
        if (c === "\\") {
          if (i >= input.length)
            throw new SyntaxError("Unterminated escape in string")
          const e = advance()
          switch (e) {
            case "n":
              out += "\n"
              break
            case "r":
              out += "\r"
              break
            case "t":
              out += "\t"
              break
            case '"':
              out += '"'
              break
            case "\\":
              out += "\\"
              break
            default:
              out += e
              break // unknown escapes: keep raw
          }
        } else {
          out += c
        }
      }
      if (input[i - 1] !== '"')
        throw new SyntaxError("Unterminated string literal")
      tokens.push({ type: "string", value: out })
      continue
    }

    // Number or symbol
    if (isSymbolInitial(ch) || ch === "-" || ch === "+" || ch === ".") {
      // read a maximal token until delimiter
      let start = i
      while (
        i < input.length &&
        !isWhitespace(input[i]) &&
        input[i] !== "(" &&
        input[i] !== ")" &&
        input[i] !== '"'
      ) {
        i++
      }
      const raw = input.slice(start, i)

      // Booleans
      if (raw === "#t") {
        tokens.push({ type: "boolean", value: true })
        continue
      }
      if (raw === "#f") {
        tokens.push({ type: "boolean", value: false })
        continue
      }

      // nil
      if (raw === "nil") {
        tokens.push({ type: "nil" })
        continue
      }

      // Numbers (int/float), allow leading +/-, decimals, exponent
      if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/u.test(raw)) {
        tokens.push({ type: "number", value: Number(raw) })
      } else {
        tokens.push({ type: "symbol", value: raw })
      }
      continue
    }

    throw new SyntaxError(`Unexpected character: ${JSON.stringify(ch)} at ${i}`)
  }

  return tokens
}

export function parseSExpr(input: string): PrimitiveSExpr[] {
  const toks = tokenize(input)
  let idx = 0

  const peek = () => toks[idx]
  const advance = () => toks[idx++]

  function readForm(): PrimitiveSExpr {
    const t = advance()
    if (!t) throw new SyntaxError("Unexpected end of input")

    switch (t.type) {
      case "lparen": {
        const list: PrimitiveSExpr[] = []
        while (peek() && peek()!.type !== "rparen") {
          list.push(readForm())
        }
        if (!peek()) throw new SyntaxError("Unmatched '('")
        advance() // consume rparen
        return list
      }
      case "rparen":
        throw new SyntaxError("Unmatched ')'")
      case "number":
        return t.value
      case "string":
        return t.value
      case "boolean":
        return t.value
      case "nil":
        return null
      case "symbol":
        return t.value // represent symbols as strings
    }
  }

  const forms: PrimitiveSExpr[] = []
  while (peek()) forms.push(readForm())
  return forms
}

/* -------------------------
   Tiny helper utilities
--------------------------*/

export function printSExpr(x: PrimitiveSExpr): string {
  if (x === null) return "nil"
  if (typeof x === "boolean") return x ? "#t" : "#f"
  if (typeof x === "number") return Number.isFinite(x) ? String(x) : "nan"
  if (typeof x === "string") {
    // naive: treat as symbol if it looks like a symbol; otherwise quote
    if (/^[^\s()"]+$/u.test(x) && x !== "nil" && x !== "#t" && x !== "#f")
      return x
    return `"${x.replace(/["\\\n\r\t]/g, (m) =>
      m === '"'
        ? '\\"'
        : m === "\\"
          ? "\\\\"
          : m === "\n"
            ? "\\n"
            : m === "\r"
              ? "\\r"
              : "\\t",
    )}"`
  }
  // list
  return `(${x.map(printSExpr).join(" ")})`
}

// Quick example:
// const program = `
//   ; define square
//   (define (square x) (* x x))
//   (list 1 2.5 "hi" #t nil foo-bar)
// `;
// const ast = parseSExpr(program);
// console.log(JSON.stringify(ast, null, 2));
// console.log(ast.map(printSExpr).join("\n"));
