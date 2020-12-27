import { mapStrings, replaceStrings } from "./mapStrings";

describe("mapStrings", () => {
	it("works", () => {
		expect(
			mapStrings(
				`ï»¿STRING 50000
{
Hello, World!
}

STRING 50001
{
How are you?
}`,
			),
		).toEqual({ 50000: "Hello, World!", 50001: "How are you?" });
	});
});

describe("replaceStrings", () => {
	it("works", () => {
		const obj = {
			a: { b: { c: "fooTRIGSTR_123bar" } },
			d: [3, "four", "TRIGSTR_124"],
		};
		const strings = {
			123: "-- Hello, World! --",
			124: "five",
		};

		expect(replaceStrings(obj, strings)).toEqual({
			a: { b: { c: "foo-- Hello, World! --bar" } },
			d: [3, "four", "five"],
		});
	});
});
