import { expect, test } from "bun:test"
import { SxClass } from "lib/sexpr"

class TestChild extends SxClass {
  static override token = "test_child"
  override token: string

  constructor(token: string) {
    super()
    this.token = token
  }
}

class OrderedParent extends SxClass {
  static override token = "ordered_parent"
  static override childPropertyOrder = ["_sxSecond", "_children", "_sxFirst"]
  override token = "ordered_parent"

  _sxFirst = new TestChild("first")
  _children = [new TestChild("middle_a"), new TestChild("middle_b")]
  _sxSecond = new TestChild("second")
}

test("childPropertyOrder returns children in declared order", () => {
  const parent = new OrderedParent()

  expect(parent.getChildren().map((child) => child.token)).toEqual([
    "second",
    "middle_a",
    "middle_b",
    "first",
  ])
})
