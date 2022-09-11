import { parsers } from "mdx-m3-viewer";
import type { UnitSpec } from "wc3data";
import { units as baseUnits } from "wc3data";

import { applyModifications, deepClone } from "./util";

const War3MapW3u = parsers.w3x.w3u.File;

export const mapUnitSpecs = (
  w3u: Parameters<InstanceType<typeof War3MapW3u>["load"]>[0],
): Record<string, UnitSpec> => {
  const file = new War3MapW3u();
  file.load(w3u);

  const units = deepClone(baseUnits);

  for (const { newId, oldId, modifications } of file.customTable.objects) {
    units[newId] = deepClone(units[oldId]);
    applyModifications(units[newId], modifications);
  }

  for (const { oldId, modifications } of file.originalTable.objects) {
    applyModifications(units[oldId], modifications);
  }

  return units;
};
