import { readFile } from "fs/promises";

import { mapUnitSpecs } from "./mapUnitSpecs";

it("works", async () => {
	const file = await readFile("src/test/data/war3map.w3u");
	const specs = mapUnitSpecs(file);

	expect(specs).toMatchObject({
		hhou: {
			stats: { HP: 120, bldtm: 1 },
			tech: { Trains: ["nC13"] },
			text: { Name: "Farm", Hotkey: "F", Tip: "Build |cffffcc00F|rarm" },
		},
		hC06: {
			stats: { HP: 350, bldtm: 2 },
			tech: { Trains: ["nC13"] },
			text: {
				Name: "TRIGSTR_1417",
				Hotkey: "TRIGSTR_1419",
				Tip: "TRIGSTR_4442",
			},
		},
	});
});
