import "reflect-metadata";
import type { Model } from "sutando";
import type { ZodObject, ZodType, ZodTypeAny } from "zod";
import { z } from "zod";

export type ISutandoModel<T = any> = new (...args: any[]) => T;

const zodFieldMetadataKey = Symbol("zodField");

export function zodField(type: ZodTypeAny) {
  return function (target: any, propertyKey: string) {
    // 只获取当前类自己的元数据，不包含父类的
    const ownFields: Record<string, ZodTypeAny> =
      Reflect.getOwnMetadata(zodFieldMetadataKey, target.constructor) ?? {};

    // 创建新对象，避免引用共享
    const newFields = { ...ownFields, [propertyKey]: type };

    Reflect.defineMetadata(zodFieldMetadataKey, newFields, target.constructor);
  };
}

// export function getZodFieldMetadata<T extends ISutandoModel>(
//   target: T,
// ): Record<keyof InstanceType<T>, ZodTypeAny> {
//   return Reflect.getMetadata(zodFieldMetadataKey, target) ?? {};
// }

export function getZodFieldMetadata<T extends ISutandoModel>(
  target: T
): Record<keyof InstanceType<T>, ZodTypeAny> {
  const fields: Record<string, ZodTypeAny> = {};

  // 递归获取父类的元数据（从父到子，子类字段会覆盖父类）
  let currentTarget: any = target;
  const chain: any[] = [];

  // 先收集继承链
  while (currentTarget && currentTarget !== Object) {
    chain.unshift(currentTarget); // 从父到子
    currentTarget = Object.getPrototypeOf(currentTarget);
  }

  // 按照从父到子的顺序合并元数据
  for (const targetClass of chain) {
    const metadata = Reflect.getOwnMetadata(zodFieldMetadataKey, targetClass);
    if (metadata) {
      Object.assign(fields, metadata);
    }
  }

  return fields as Record<keyof InstanceType<T>, ZodTypeAny>;
}

export type ISpecialModelFields =
  // 1. 过滤 Model 所有 public 的 key 或 fn
  | keyof Model
  // 2. 不幸的是，Model 定义了很多 protected，本来 ts 是拿不到的，不用过滤也行，
  // 但是在 xModel extends Model 的时候，你大概率不会写上 protected，都变成了 public，
  // 所以这里明确写下我枚举到的所有 protected
  | "attributes"
  | "relations"
  | "primaryKey"
  | "builder"
  | "table"
  | "connection"
  | "keyType"
  | "incrementing"
  | "perPage"
  | "with"
  | "withCount"
  | "trx"
  | "timestamps"
  | "dateFormat";

// 自动过滤 relation 开头的字段和特殊字段
export type IFilterModelFields<TModel> = {
  [K in keyof TModel]: K extends ISpecialModelFields
    ? never
    : K extends `relation${string}`
    ? never
    : K;
}[keyof TModel];

export function genModelToZodSchema<T extends ISutandoModel>(
  target: T
): ZodObject<{
  [K in IFilterModelFields<InstanceType<T>>]: T extends {
    new (): { [P in K]: infer R };
  }
    ? ZodType<R>
    : never;
}> {
  const fields = getZodFieldMetadata(target);
  const shape: Record<string, ZodTypeAny> = {};

  for (const [key, type] of Object.entries(fields)) {
    shape[key] = type;
  }

  return z.object(shape) as any;
}
