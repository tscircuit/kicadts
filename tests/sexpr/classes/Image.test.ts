import {
  At,
  Image,
  ImageData,
  ImageScale,
  Layer,
  SxClass,
  Uuid,
} from "lib/sexpr"
import { expect, test } from "bun:test"

test("Image", () => {
  const [image] = SxClass.parse(`
    (image
      (at 12.7 25.4 90)
      (scale 0.75)
      (layer F.SilkS B.SilkS)
      (uuid 12345678-1234-1234-1234-123456789abc)
      (data iVBORw0KGgoAAAANSUhEUgAAAAUA)
    )
  `)

  expect(image).toBeInstanceOf(Image)
  const img = image as Image

  const at = img.position as At
  expect(at.x).toBe(12.7)
  expect(at.y).toBe(25.4)
  expect(at.angle).toBe(90)

  const scale = img.scale as ImageScale
  expect(scale.value).toBe(0.75)

  const layer = img.layer as Layer
  expect(layer.names).toEqual(["F.SilkS", "B.SilkS"])

  const uuid = img.uuid as Uuid
  expect(uuid.value).toBe("12345678-1234-1234-1234-123456789abc")

  const data = img.data as ImageData
  expect(data.value).toBe("iVBORw0KGgoAAAANSUhEUgAAAAUA")

  img.scale = 1.2
  img.layer = "F.Cu"
  img.uuid = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
  img.data = "ZGF0YQ=="
  img.position = new At([0, 0])

  expect(img.getString()).toMatchInlineSnapshot(`
    "(image
      (at 0 0)
      (scale 1.2)
      (layer F.Cu)
      (uuid aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee)
      (data \"ZGF0YQ==\")
    )"
  `)
})
