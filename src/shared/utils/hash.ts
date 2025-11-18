// import bcrypt from 'bcryptjs';

// const SALT_ROUNDS = 12;

// export const hashPassword = async (raw: string): Promise<string> => {
//   return bcrypt.hash(raw, SALT_ROUNDS);
// };

// export const comparePassword = async (
//   raw: string,
//   hash: string,
// ): Promise<boolean> => {
//   return bcrypt.compare(raw, hash);
// };

// password.ts
// TypeScript - WebCrypto PBKDF2 通用实现（Cloudflare Worker + Node.js 支持）

export type IPasswordHashString = string; // 存储和传递的 hash 字符串

// 配置
const SALT_BYTES = 16; // salt 长度（字节）
const ITERATIONS = 100_000; // PBKDF2 迭代次数（可调整）
const HASH_NAME = "SHA-256";
const DERIVED_BITS = 256; // 输出比特数（256 bits = 32 bytes）

/**
 * 获取全局 crypto.subtle（兼容 Cloudflare Worker & Node.js）
 */
async function getSubtleCrypto(): Promise<SubtleCrypto> {
  // 浏览器/Worker 环境
  if (
    typeof globalThis !== "undefined" &&
    (globalThis as any).crypto &&
    (globalThis as any).crypto.subtle
  ) {
    return (globalThis as any).crypto.subtle as SubtleCrypto;
  }
  // Node.js 环境（动态 import 以兼容 ESM/CJS）
  // node:crypto.webcrypto 提供 webcrypto 实现
  // 注意：在旧版本 Node 可能不可用
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = await import("node:crypto");
  if (!nodeCrypto?.webcrypto?.subtle) {
    throw new Error("No WebCrypto available in this environment.");
  }
  return nodeCrypto.webcrypto.subtle;
}

/**
 * 获取可用于 getRandomValues 的 Crypto（用于产生 salt）
 */
async function getCrypto(): Promise<Crypto> {
  if (typeof globalThis !== "undefined" && (globalThis as any).crypto) {
    return (globalThis as any).crypto as Crypto;
  }
  const nodeCrypto = await import("node:crypto");
  if (!nodeCrypto?.webcrypto) {
    throw new Error("No crypto available in this environment.");
  }
  return nodeCrypto.webcrypto as unknown as Crypto;
}

/** Uint8Array -> hex */
function toHex(buf: Uint8Array): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** hex -> Uint8Array */
function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

/** 常量时间比较两个 Uint8Array，防止时序攻击 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * 生成密码 hash
 * 返回格式： pbkdf2$sha256$<iterations>$<saltHex>$<hashHex>
 */
export async function hashPassword(
  raw: string,
  iterations = ITERATIONS
): Promise<IPasswordHashString> {
  const subtle = await getSubtleCrypto();
  const cryptoGlobal = await getCrypto();

  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(raw);

  // 产生 salt
  const salt = cryptoGlobal.getRandomValues(new Uint8Array(SALT_BYTES));

  // 导入密码作为 key material
  const baseKey = await subtle.importKey(
    "raw",
    passwordBytes,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // 派生 bits（长度以 bit 为单位）
  const derived = await subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: HASH_NAME,
    },
    baseKey,
    DERIVED_BITS
  );

  const derivedBytes = new Uint8Array(derived); // 32 bytes
  const saltHex = toHex(salt);
  const hashHex = toHex(derivedBytes);

  // 存储时带上元信息（算法、迭代次数）
  return `pbkdf2$sha256$${iterations}$${saltHex}$${hashHex}`;
}

/**
 * 比较明文密码与存储的 hash（返回 boolean）
 */
export async function comparePassword(
  raw: string,
  stored: IPasswordHashString
): Promise<boolean> {
  try {
    // 解析格式：pbkdf2$sha256$<iterations>$<saltHex>$<hashHex>
    const parts = stored.split("$");
    if (parts.length !== 5) return false;
    const [scheme, alg, iterStr, saltHex, hashHex] = parts;
    if (scheme !== "pbkdf2" || alg !== "sha256") return false;

    const iterations = parseInt(iterStr, 10);
    if (!Number.isFinite(iterations) || iterations <= 0) return false;

    const salt = fromHex(saltHex);
    const expected = fromHex(hashHex);

    const subtle = await getSubtleCrypto();
    const encoder = new TextEncoder();

    const baseKey = await subtle.importKey(
      "raw",
      encoder.encode(raw),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derived = await subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: HASH_NAME,
      },
      baseKey,
      expected.length * 8 // bits
    );

    const derivedBytes = new Uint8Array(derived);
    return constantTimeEqual(derivedBytes, expected);
  } catch (e) {
    // 解析或派生出错时返回 false（不要抛出明文错误以防泄漏）
    return false;
  }
}

/**
 * 便捷：校验失败则抛出错误（适合 handler 使用）
 */
export async function verifyPasswordOrThrow(
  raw: string,
  stored: IPasswordHashString
): Promise<void> {
  const ok = await comparePassword(raw, stored);
  if (!ok) {
    const e: any = new Error("Invalid credentials");
    e.status = 401;
    throw e;
  }
}

/** 可导出常量以便外部参考 */
export const PasswordConfig = {
  SALT_BYTES,
  ITERATIONS,
  HASH_NAME,
  DERIVED_BITS,
};
