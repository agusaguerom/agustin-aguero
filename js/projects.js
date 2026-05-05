(function () {
    const TOAST_VISIBLE_CLASS = "is-visible";

    const showToast = (message) => {
        let toast = document.querySelector("[data-toast]");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            toast.dataset.toast = "";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add(TOAST_VISIBLE_CLASS);

        window.clearTimeout(showToast.timeoutId);
        showToast.timeoutId = window.setTimeout(() => {
            toast.classList.remove(TOAST_VISIBLE_CLASS);
        }, 2600);
    };

    const init = () => {
        document.querySelector("[data-download-cv]")?.addEventListener("click", () => {
            showToast("Todavia no hay CV cargado. Cuando lo agregues, conectamos este boton al PDF.");
        });
    };

    window.PortfolioProjects = { init };
})();
