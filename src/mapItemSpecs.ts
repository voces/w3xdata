import type { ItemSpec } from "wc3data";
import { items as baseItems } from "wc3data";

import type { W3uW3tInput } from "./util";
import { applyDataFile } from "./util";

export const mapItemSpecs = (
  w3t: W3uW3tInput,
  w3tSkin?: W3uW3tInput,
): Record<string, ItemSpec> => {
  const items = structuredClone(baseItems);
  applyDataFile(items, w3t, "item");
  if (w3tSkin) applyDataFile(items, w3tSkin, "item");
  return items;
};
