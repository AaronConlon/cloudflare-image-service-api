import { format, type SqlLanguage } from "sql-formatter";
import { highlight } from "sql-highlight";

export const fmtSqlKeywordToUpper = (
  sqlStr: string,
  opts: {
    language: SqlLanguage;
  }
) => {
  return format(sqlStr, {
    language: opts.language,
    tabWidth: 2,
    keywordCase: "upper",
    linesBetweenQueries: 2,
  });
};

export function mergeDbQueryBindingsToSqlStr(opts: {
  sqlStr: string;
  bindings: any[];
}): string {
  let index = 0;

  return opts.sqlStr.replace(/\?/g, () => {
    const value = opts.bindings[index++];
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`; // SQL 字符串要单引号并转义
    } else if (value === null || value === undefined) {
      return "NULL";
    } else {
      return String(value);
    }
  });
}

export const fmtDbQueryData = (queryData: {
  method: string;
  sqlStr: string;
  bindings: any[];
  language: SqlLanguage;
}) => {
  console.log(`\n\n\n\n[SQL Query Log] (${queryData.language})`);
  console.log("".padEnd(80, "-"));
  // console.log(''.padEnd(80, '-'));
  console.log({
    method: queryData.method,
    sql: queryData.sqlStr,
    bindings: queryData.bindings,
  });
  // console.log(''.padEnd(80, '-'));
  console.log("");
  console.log(
    highlight(
      fmtSqlKeywordToUpper(
        mergeDbQueryBindingsToSqlStr({
          sqlStr: queryData.sqlStr,
          bindings: queryData.bindings,
        }),
        {
          language: queryData.language,
        }
      )
    )
  );
  console.log("");
};


// 检查是否是 d1 error
export function isD1Error(e: unknown) {
  const msg =
    typeof e === "object" && e !== null
      ? // 新版（wrangler ≥ 3.1.1）：错误直接在 e.message
        (e as any).message ??
        // 旧版：详细信息在 cause.message
        (e as any).cause?.message
      : undefined;

  if (typeof msg !== "string") return false;

  // 检测是否有 D1 错误字符串
  return /D1_(ERROR|EXEC_ERROR|TYPE_ERROR|COLUMN_NOTFOUND)/.test(msg);
}