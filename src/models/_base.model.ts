import { zodField } from "@/shared/utils/z-field.decorator";
import { z } from "@hono/zod-openapi";
import { compose, HasUniqueIds, Model, SoftDeletes } from "sutando";

export class BaseModel extends compose(Model, HasUniqueIds, SoftDeletes) {
  incrementing = false;
  // 如果你的模型主键不是 int，你需要设置 keyType 为 string
  keyType = "string";

  // created_at
  @zodField(
    z.string().openapi({
      example: "2021-01-01T00:00:00.000Z",
      description: "The date and time the record was created",
    })
  )
  created_at!: string;

  @zodField(
    z.string().openapi({
      example: "2021-01-01T00:00:00.000Z",
      description: "The date and time the record was updated",
    })
  )
  updated_at!: string;

  @zodField(
    z.string().openapi({
      example: "2021-01-01T00:00:00.000Z",
      description: "The date and time the record was deleted",
    })
  )
  deleted_at!: string;
}
