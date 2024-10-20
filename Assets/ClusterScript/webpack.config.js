const path = require("path");
const glob = require("glob");

const entries = {};
const srcDir = "./src";
glob
	.sync("*.js", {
		cwd: srcDir,
	})
	.map((value) => {
		entries[value] = path.resolve(srcDir, value);
	});

module.exports = {
	mode: process.env.WEBPACK_ENV,
	devtool: false,
	target: "node",
	entry: entries,
	output: {
		filename: "[name]",
		path: path.resolve(__dirname, "dist"),
	},
};
