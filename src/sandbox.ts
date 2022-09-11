/* eslint-disable no-console */
import { promises as fs } from "fs";
import { inspect } from "util";

import { mapUnitSpecs } from "./index";

fs.readFile("./src/test/data/war3map.w3u").then((buffer) => {
  const result = mapUnitSpecs(buffer);
  console.log(inspect(result, false, 4, true));
});
