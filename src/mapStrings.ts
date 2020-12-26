import { StringsTranslator } from "@voces/wc3maptranslator/lib/translators/StringsTranslator";

export const mapStrings = (wts: Buffer): Record<string, string> => {
	const translator = new StringsTranslator();
	const { errors, json } = translator.warToJson(wts);
	if (errors.length) throw errors;

	return json;
};

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
