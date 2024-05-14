import { getCurrent } from "@tauri-apps/api/window";

console.log("preload.js loaded");

const i = setInterval(() => {
	const userSection = document.querySelector(".userSection");
	if (userSection) {
		const button = userSection.querySelector(".selectServer");

		if (button) {
			if (!button.classList.contains("hide")) {
				return;
			}

			button.classList.remove("hide");
			button.addEventListener("click", (e) => {
				e.preventDefault();
				// TODO: check if theres a programmatic way to get this url
				window.location.href = "http://tauri.localhost/?reset";
			});
		}
	}

	const fullscreenButton = document.querySelector(".btnFullscreen");

	if (fullscreenButton) {
		fullscreenButton.addEventListener("click", async (e) => {
			e.preventDefault();
			const win = getCurrent();

			await win.setFullscreen(!win.isFullscreen());
		});
	}
}, 500);

window.addEventListener("beforeunload", () => {
	clearInterval(i);
});
