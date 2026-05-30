import { parsers } from "mdx-m3-viewer-th";
import type Modification from "mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modification";
import type { ItemSpec, TypeSpec, UnitSpec } from "wc3data";
import { castValue, types } from "wc3data";

const War3MapW3uFile = parsers.w3x.w3u.File;
export type W3uW3tInput = Parameters<
  InstanceType<typeof War3MapW3uFile>["load"]
>[0];

/** The object class a data file describes, used to gate field modifications. */
export type ObjectClass = "item" | "unit";

// Each `types` entry carries use-flags marking which object classes a field
// applies to. The WC3 engine silently ignores modifications whose field does
// not apply to the object (e.g. a unit-icon `uico` override on an item), so we
// honor the same flags. The unit file mixes units, heroes and buildings, so a
// modification on a "unit" qualifies if any of those flags is set.
const classUseFlags = {
  item: ["useItem"],
  unit: ["useUnit", "useHero", "useBuilding"],
} as const satisfies Record<ObjectClass, readonly (keyof TypeSpec)[]>;

export const applyDataFile = <T extends UnitSpec | ItemSpec>(
  specs: Record<string, T>,
  input: W3uW3tInput,
  objectClass: ObjectClass,
): void => {
  const file = new War3MapW3uFile();
  file.load(input);

  for (const { newId, oldId, modifications } of file.customTable.objects) {
    if (!specs[newId]) specs[newId] = structuredClone(specs[oldId]);
    applyModifications(specs[newId], modifications, objectClass);
  }

  for (const { oldId, modifications } of file.originalTable.objects) {
    applyModifications(specs[oldId], modifications, objectClass);
  }
};

export const applyModifications = (
  spec: UnitSpec | ItemSpec,
  modifications: Modification[],
  objectClass: ObjectClass,
): void => {
  // deno-lint-ignore no-explicit-any
  const unsafeSpec: any = spec;
  for (const modification of modifications) {
    const type = types[modification.id];
    if (!type) {
      console.warn(`Skipping modification ${modification.id}`);
      continue;
    }

    // Skip fields that don't apply to this object class, matching the engine.
    // (Not logged: real map data routinely carries non-applicable fields, e.g.
    // unit-only fields stored alongside items in skin files, so warning here
    // would be very noisy.)
    if (!classUseFlags[objectClass].some((flag) => type[flag])) continue;

    const category = type.category;
    if (category) {
      if (!unsafeSpec[category]) unsafeSpec[category] = {};
      unsafeSpec[category][type.field] = castValue(
        modification.value.toString(),
        type.field,
        type,
      );
    } else {
      unsafeSpec[type.field] = castValue(
        modification.value.toString(),
        type.field,
        type,
      );
    }
  }
};
