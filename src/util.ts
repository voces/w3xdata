import type Modification from "mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modification";
import type { ItemSpec, UnitSpec } from "wc3data";
import { castValue, types } from "wc3data";

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
