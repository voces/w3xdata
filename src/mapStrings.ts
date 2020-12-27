import War3MapWts from "mdx-m3-viewer/dist/parsers/w3x/wts/file";

export const mapStrings = (wts: string): Record<string, string> =>
	Object.fromEntries(new War3MapWts(wts).stringMap.entries());

export const replaceStrings = <T>(
	value: T,
	strings: Record<string, string>,
): T => {
	if (typeof value === "object" && value !== null) {
		for (const prop in value)
			value[prop] = replaceStrings(value[prop], strings);

		return value;
	}

	if (typeof value === "string")
		return (value.replace(/TRIGSTR_([0-9]+)/, (_, id) => {
			if (!(id in strings)) console.warn(`Missing TRIGSTR_${id}`);

			return strings[id];
		}) as unknown) as T;

	return value;
};
