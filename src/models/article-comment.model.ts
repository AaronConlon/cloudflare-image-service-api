import { zodField } from "@/shared/utils/z-field.decorator";
import { z } from "@hono/zod-openapi";
import { ulid } from "ulid";
import { BaseModel } from "./_base.model";
import { ArticleModel } from "./article.model";

export class ArticleCommentModel extends BaseModel {
  table = "article_comments";
  hidden = ["deleted_at"];

  newUniqueId() {
    return ulid();
  }

  // fields

  // id
  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  id!: string;

  // content
  @zodField(z.string().openapi({ example: "This is a comment" }))
  content!: string;

  // article id
  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  article_id!: string;

  // parent comment id
  @zodField(z.string().nullable().openapi({ example: "1234567890abcdef" }))
  parent_comment_id!: string;

  // author id
  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  author_id!: string;

  //
  // RELATIONS -----------------------------------------------------------------
  relationArticle() {
    // 只要你用的是 belongsTo，第 2 个参数永远是当前这张表的外键字段。
    return this.belongsTo(ArticleModel, "article_id", "id");
  }
}
