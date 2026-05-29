import { readFile } from "fs/promises";

import { mapUnitSpecs } from "./mapUnitSpecs";

it("works", async () => {
  const file = await readFile("src/test/data/war3map.w3u");
  const specs = mapUnitSpecs(file);

  expect(specs).toMatchObject({
    hhou: {
      stats: { HP: 120, bldtm: 1 },
    },
    hC06: {
      stats: { HP: 350, bldtm: 2 },
      tech: { Trains: ["nC13"] },
    },
  });
});

it("applies skin overrides on top of the main w3u", async () => {
  const [w3u, skin] = await Promise.all([
    readFile("src/test/data/war3map.w3u"),
    readFile("src/test/data/war3mapSkin.w3u"),
  ]);
  const specs = mapUnitSpecs(w3u, skin);

  expect(specs.hC06).toMatchObject({
    stats: { HP: 350, bldtm: 2 },
    text: {
      Name: "TRIGSTR_1417",
      Hotkey: "TRIGSTR_1419",
      Tip: "TRIGSTR_4442",
      Ubertip: "TRIGSTR_1529",
    },
  });
});
