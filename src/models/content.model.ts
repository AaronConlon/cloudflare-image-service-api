import { zodField } from "@/shared/utils/z-field.decorator";
import { z } from "@hono/zod-openapi";
import { compose, HasUniqueIds, Model, SoftDeletes } from "sutando";
import { ArticleModel } from "./article.model";

export class ContentModel extends compose(Model, HasUniqueIds, SoftDeletes) {
  table = "contents";
  hidden = ["deleted_at"];
  keyType = "string";

  // fields
  @zodField(z.string().openapi({ example: "This is a content" }))
  content!: string;

  // content_id

  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  content_id!: string;

  //
  // RELATIONS -----------------------------------------------------------------
  relationArticles() {
    // 只要你用的是 belongsTo，第 2 个参数永远是当前这张表的外键字段。
    return this.belongsTo(ArticleModel, "content_id", "id");
  }
}
