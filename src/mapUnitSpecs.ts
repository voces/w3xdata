import ObjectsTranslator from "@voces/wc3maptranslator/lib/translators/object/ObjectsTranslator";
import { units as baseUnits, UnitSpec } from "wc3data/dist/index";

import { applyModifications, deepClone } from "./util";

export const mapUnitSpecs = (w3u: Buffer): Record<string, UnitSpec> => {
	const translator = new ObjectsTranslator.ObjectsTranslator();
	const { errors, json } = translator.warToJson(
		translator.ObjectType.Units,
		w3u,
	);
	if (errors.length) throw errors;

	const units = deepClone(baseUnits);

	for (const [key, modifications] of Object.entries(json.custom)) {
		const [type, baseType] = key.split(":");
		units[type] = deepClone(units[baseType]);
		applyModifications(units[type], modifications);
	}

	for (const [key, modifications] of Object.entries(json.original))
		applyModifications(units[key], modifications);

	return units;
};
