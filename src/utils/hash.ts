import SparkMD5 from "spark-md5";

export const md5Hex = (input: ArrayBuffer | Uint8Array): string => {
  const buffer =
    input instanceof ArrayBuffer
      ? input
      : input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);

  return SparkMD5.ArrayBuffer.hash(buffer);
};
