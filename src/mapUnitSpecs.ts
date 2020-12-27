import War3MapW3u from "mdx-m3-viewer/dist/parsers/w3x/w3u/file";
import { units as baseUnits, UnitSpec } from "wc3data/dist/index";

import { applyModifications, deepClone } from "./util";

export const mapUnitSpecs = (w3u: TypedArray): Record<string, UnitSpec> => {
	const file = new War3MapW3u(w3u);

	const units = deepClone(baseUnits);

	for (const { newId, oldId, modifications } of file.customTable.objects) {
		units[newId] = deepClone(units[oldId]);
		applyModifications(units[newId], modifications);
	}

	for (const { oldId, modifications } of file.originalTable.objects)
		applyModifications(units[oldId], modifications);

	return units;
};
