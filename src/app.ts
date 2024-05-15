import Spinner from "~icons/svg-spinners/ring-resize";

import { invoke } from "@tauri-apps/api/core";
import { type Update, check } from "@tauri-apps/plugin-updater";

import "virtual:uno.css";
import "@unocss/reset/tailwind.css";

declare global {
	interface Window {
		__TAURI__: unknown;
	}
}

const inTauri = window.__TAURI__;

const resolveJellyfin = async (url: string) => {
	if (!inTauri) {
		return url;
	}

	const res = await invoke<{
		LocalAddress: string;
	}>("resolve_jellyfin", { url });

	return res.LocalAddress;
};

const setJellyfinUrl = async (url: string) => {
	return localStorage.setItem("jellyfin_url", url);
};

const getJellyfinUrl = async () => {
	return localStorage.getItem("jellyfin_url") as string | undefined;
};

const setError = (message: string) => {
	const error = document.querySelector(".error")!;

	error.innerHTML = message;
	error.classList.remove("hidden");
};

const clearError = () => {
	const error = document.querySelector(".error")!;

	error.textContent = "";
	error.classList.add("hidden");
};

const updateCheck = async () => {
	if (!inTauri) {
		return;
	}

	const update: Update | null = await check().catch((e) => {
		console.error(e);
		return null;
	});

	if (update?.available) {
		console.log("Update available", update);

		const updateEl = document.querySelector(".update")!;

		updateEl.classList.remove("hidden");

		await update.downloadAndInstall();
	}
};

const onLoad = async () => {
	for (const el of Array.from(document.querySelectorAll(".spinner"))) {
		el.innerHTML = Spinner;
	}

	if (window.location.search.includes("reset")) {
		await setJellyfinUrl("");
	}

	await updateCheck();

	const url = await getJellyfinUrl();

	if (url) {
		window.location.href = url;
		return;
	}

	document.querySelector(".loader")!.classList.add("hidden");
	document.querySelector(".content")!.classList.remove("hidden");
	document.querySelector(".content")!.classList.add("flex");

	const form = document.querySelector("form");

	if (!form) {
		return;
	}

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		clearError();

		// validate form
		const valid = form.reportValidity();

		if (!valid) {
			return;
		}

		const button = form.querySelector("button")!;

		button.disabled = true;

		const input = form.querySelector("input")!;

		input.disabled = true;

		if (!input?.value) {
			button.disabled = false;
			input.disabled = false;
			return setError("Please enter a URL.");
		}

		if (
			!input.value.startsWith("http://") &&
			!input.value.startsWith("https://")
		) {
			input.value = `http://${input.value}`;
		}

		if (!input.value.endsWith("/")) {
			input.value = `${input.value}/`;
		}

		const isValid = await resolveJellyfin(input.value).catch((err) => {
			setError(err.message || err || "An error occurred.");
			return false;
		});

		if (!isValid) {
			button.disabled = false;
			input.disabled = false;
			return;
		}

		await setJellyfinUrl(input.value);

		window.location.href = input.value;
	});
};

document.addEventListener("DOMContentLoaded", onLoad);

if (
	document.readyState === "interactive" ||
	document.readyState === "complete"
) {
	onLoad();
}
