import { compose, HasUniqueIds, Model } from "sutando";
import { ulid } from "ulid";

export class BaseModel extends compose(Model, HasUniqueIds) {
  incrementing = false;
  // 如果你的模型主键不是 int，你需要设置 keyType 为 string
  keyType = "string";

  newUniqueId() {
    return ulid();
  }
}
