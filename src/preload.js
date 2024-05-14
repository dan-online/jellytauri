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
      window.location.href = "http://localhost:5173/?reset";
    });
  }
}, 500);

window.addEventListener("beforeunload", () => {
  clearInterval(i);
});
