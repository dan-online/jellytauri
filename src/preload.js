console.log("preload.js loaded");

const i = setInterval(() => {
  const userSection = document.querySelector(".userSection");
  if (userSection) {
    const button = userSection.querySelector(".selectServer");

    if (!button.classList.contains("hide")) {
      return;
    }

    button.classList.remove("hide");
    button.addEventListener("click", (e) => {
      e.preventDefault();
      // todo: check if theres a programmatic way to get this url
      window.location.href = "http://tauri.localhost/?reset";
    });
  }
}, 500);

window.addEventListener("beforeunload", () => {
  clearInterval(i);
});
