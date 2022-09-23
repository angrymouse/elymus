const { build } = require("esbuild");

build({
	entryPoints: ["./src/index.js"],
	outdir: "./build/core",
	sourcemap: true,
	minify: true,
	platform: "node",
	bundle: true,
	format: "iife",
}).catch(() => process.exit(1));
// note: Warp SDK currently does not support files in IIFE bundle format, so we need to remove the "iife" part ;-)
// update: it does since 0.4.31, but because viewblock.io is still incompatibile with this version, leaving as is for now.
