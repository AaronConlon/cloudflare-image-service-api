import { zodField } from "@/shared/utils/z-field.decorator";
import { z } from "@hono/zod-openapi";
import { ulid } from "ulid";
import { BaseModel } from "./_base.model";
import { ContentModel } from "./content.model";
import { UserModel } from "./user.model";

export class ArticleModel extends BaseModel {
  table = "articles";
  hidden = ["deleted_at"];

  newUniqueId() {
    return ulid();
  }

  // id
  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  id!: string;

  // fields
  @zodField(z.string().openapi({ example: "This is a title" }))
  title!: string;

  @zodField(z.string().openapi({ example: "This is a summary" }))
  summary!: string;

  @zodField(z.string().openapi({ example: "This is a cover image" }))
  cover_image!: string;

  // status 'draft', 'pending', 'approved', 'rejected'
  @zodField(
    z
      .enum(["draft", "pending", "approved", "rejected"])
      .openapi({ example: "draft" })
  )
  status!: string;

  @zodField(z.string().openapi({ example: "This is a published at" }))
  published_at!: string;

  @zodField(z.number().openapi({ example: 0 }))
  views_count!: number;

  @zodField(z.number().openapi({ example: 0 }))
  likes_count!: number;

  // author id
  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  author_id!: string;

  // content id
  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  content_id!: string;

  //
  // RELATIONS -----------------------------------------------------------------
  relationAuthor() {
    return this.belongsTo(UserModel, "author_id", "id");
  }

  relationContent() {
    return this.hasOne(ContentModel, "content_id", "id");
  }
}
