import { parsers } from "mdx-m3-viewer-th";
import type { ItemSpec } from "wc3data";
import { items as baseItems } from "wc3data";

import { applyModifications } from "./util";

const War3MapW3t = parsers.w3x.w3u.File;

export const mapItemSpecs = (
  w3t: Parameters<InstanceType<typeof War3MapW3t>["load"]>[0],
): Record<string, ItemSpec> => {
  const file = new War3MapW3t();
  file.load(w3t);

  const items = structuredClone(baseItems);

  for (const { newId, oldId, modifications } of file.customTable.objects) {
    items[newId] = structuredClone(items[oldId]);
    applyModifications(items[newId], modifications);
  }

  for (const { oldId, modifications } of file.originalTable.objects) {
    applyModifications(items[oldId], modifications);
  }

  return items;
};
