import { parsers } from "mdx-m3-viewer";

const War3MapWts = parsers.w3x.wts.File;

export const mapStrings = (wts: string): Record<string, string> => {
  const parser = new War3MapWts();
  parser.load(wts);
  return Object.fromEntries(parser.stringMap.entries());
};

export const replaceStrings = <T>(
  value: T,
  strings: Record<string, string>,
): T => {
  if (typeof value === "object" && value !== null) {
    for (const prop in value) {
      value[prop] = replaceStrings(value[prop], strings);
    }

    return value;
  }

  if (typeof value === "string") {
    return (value.replace(/TRIGSTR_([0-9]+)/, (_, id) => {
      if (!(id in strings)) console.warn(`Missing TRIGSTR_${id}`);

      return strings[id];
    }) as unknown) as T;
  }

  return value;
};
