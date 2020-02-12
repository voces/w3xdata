
module.exports = {
	extends: [
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"verit"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	rules: {
		"no-undef": 0,
		"@typescript-eslint/camelcase": 0,
		"padded-blocks": ["error", "always", {allowSingleLineBlocks: true}],
		"no-unused-vars": 0, // covered by TypeScript
		"@typescript-eslint/no-empty-function": 1,
		// "@typescript-eslint/strict-boolean-expressions": 2
	},
};
