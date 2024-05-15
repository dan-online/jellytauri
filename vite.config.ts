import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
	plugins: [
		UnoCSS(),
		Icons({
			compiler: "raw",
		}),
	],
});
