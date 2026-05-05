(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const initProjectTransitions = () => {
        const links = document.querySelectorAll(".project[href]");

        if (!links.length || reduceMotion) {
            return;
        }

        links.forEach((link) => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href");

                if (!href || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                    return;
                }

                event.preventDefault();
                document.body.classList.add("is-leaving");
                link.classList.add("is-opening");

                window.setTimeout(() => {
                    window.location.href = href;
                }, 320);
            });
        });
    };

    const init = () => {
        initProjectTransitions();
    };

    window.PortfolioMotion = { init };
})();
