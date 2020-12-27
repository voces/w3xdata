import Modification from "mdx-m3-viewer/dist/parsers/w3x/w3u/modification";
import { castValue, types, UnitSpec } from "wc3data";

// todo: use an actual algorithm
export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const applyModifications = (
	unit: UnitSpec,
	modifications: Modification[],
): void => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const unsafeUnit: any = unit;
	for (const modification of modifications) {
		const type = types[modification.id];
		if (!type) {
			console.warn(`Skipping modification ${modification.id}`);
			continue;
		}

		const category = type.category;
		if (category) {
			if (!unsafeUnit[category]) unsafeUnit[category] = {};
			unsafeUnit[category][type.field] = castValue(
				modification.value.toString(),
				type.field,
				type,
			);
		} else
			unsafeUnit[type.field] = castValue(
				modification.value.toString(),
				type.field,
				type,
			);
	}
};
