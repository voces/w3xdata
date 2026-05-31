import { readFile } from "fs/promises";

import { mapItemSpecs } from "./mapItemSpecs";

it("works", async () => {
  const file = await readFile("src/test/data/war3map.w3t");
  const specs = mapItemSpecs(file);

  expect(specs).toMatchObject({
    I000: {
      stats: { class: "Permanent", goldcost: 300, Level: 5 },
      text: { Name: "Claws of Attack +12" },
    },
    ratf: {
      stats: { class: "Artifact", goldcost: 126, Level: 6 },
    },
  });
});

it("applies skin overrides on top of the main w3t", async () => {
  const [w3t, skin] = await Promise.all([
    readFile("src/test/data/war3map.w3t"),
    readFile("src/test/data/war3mapSkin.w3t"),
  ]);
  const specs = mapItemSpecs(w3t, skin);

  expect(specs.I000).toMatchObject({
    stats: { goldcost: 300, Level: 5 },
    text: { Name: "TRIGSTR_1510", Description: "TRIGSTR_1511" },
    art: { Art: "ReplaceableTextures\\CommandButtons\\BTNThoriumMelee.tga" },
  });
});

it("honors item use-flags, ignoring fields that don't apply to items", async () => {
  const [w3t, skin] = await Promise.all([
    readFile("src/test/data/war3map.w3t"),
    readFile("src/test/data/war3mapSkin.w3t"),
  ]);
  const specs = mapItemSpecs(w3t, skin);

  // I000's icon override uses iico (the item-icon field, useItem=1), so it
  // applies. I003 (a custom item based on ches) instead has a uico override,
  // the unit-icon field (useItem=0); the engine ignores it, so I003 keeps its
  // base cheese icon.
  expect(specs.I000.art).toMatchObject({
    Art: "ReplaceableTextures\\CommandButtons\\BTNThoriumMelee.tga",
  });
  expect(specs.I003.art).toMatchObject({
    Art: "ReplaceableTextures\\CommandButtons\\BTNCheese.blp",
  });
});
