import { parsers } from "mdx-m3-viewer-th";
import type Modification from "mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modification";
import type { ItemSpec, UnitSpec } from "wc3data";
import { castValue, types } from "wc3data";

const War3MapW3uFile = parsers.w3x.w3u.File;
export type W3uW3tInput = Parameters<
  InstanceType<typeof War3MapW3uFile>["load"]
>[0];

export const applyDataFile = <T extends UnitSpec | ItemSpec>(
  specs: Record<string, T>,
  input: W3uW3tInput,
): void => {
  const file = new War3MapW3uFile();
  file.load(input);

  for (const { newId, oldId, modifications } of file.customTable.objects) {
    if (!specs[newId]) specs[newId] = structuredClone(specs[oldId]);
    applyModifications(specs[newId], modifications);
  }

  for (const { oldId, modifications } of file.originalTable.objects) {
    applyModifications(specs[oldId], modifications);
  }
};

export const applyModifications = (
  spec: UnitSpec | ItemSpec,
  modifications: Modification[],
): void => {
  // deno-lint-ignore no-explicit-any
  const unsafeSpec: any = spec;
  for (const modification of modifications) {
    const type = types[modification.id];
    if (!type) {
      console.warn(`Skipping modification ${modification.id}`);
      continue;
    }

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
