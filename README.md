# w3xdata

`w3xdata` allows for extracting Warcraft 3 map data in a typed, semi-structured
way.

## Examples

```typescript
import { mapStrings, mapUnitSpecs, replaceStrings } from "w3xdata";
import { promises as fs } from "fs";

Promise.all([
  fs.readFile("map/war3map.w3u"),
  fs.readFile("map/war3map.wts"),
]).then(([w3u, wts]) => {
  const strings = mapStrings(wts);
  const units = replaceStrings(mapUnitSpecs(w3u), strings);

  console.log(units.hfoo.text?.Name); // "Footman"
  console.log(units.h001.text?.Name); // "Custom Footman"
});
```
