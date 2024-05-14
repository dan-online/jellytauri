import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/preload.ts"],
	target: "es6",
});
