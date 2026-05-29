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
