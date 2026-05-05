(function () {
    const ACTIVE_SIDE_CLASS = "side-nav__link--active";

    const getHeaderOffset = () => {
        return 16;
    };

    const setActiveLink = (hash) => {
        document.querySelectorAll("[data-nav-link]").forEach((link) => {
            const isActive = link.getAttribute("href") === hash;

            link.classList.toggle(ACTIVE_SIDE_CLASS, isActive && link.classList.contains("side-nav__link"));
        });
    };

    const scrollToSection = (hash) => {
        const target = document.querySelector(hash);

        if (!target) {
            return;
        }

        const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    };

    const observeActiveSection = () => {
        const sections = document.querySelectorAll("[data-section]");

        if (!sections.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visibleEntry) {
                    setActiveLink(`#${visibleEntry.target.id}`);
                }
            },
            {
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0.15, 0.35, 0.6],
            }
        );

        sections.forEach((section) => observer.observe(section));
    };

    const init = () => {
        document.querySelectorAll("[data-nav-link]").forEach((link) => {
            link.addEventListener("click", (event) => {
                const hash = link.getAttribute("href");

                if (!hash || !hash.startsWith("#")) {
                    return;
                }

                event.preventDefault();
                scrollToSection(hash);
                setActiveLink(hash);
                history.replaceState(null, "", hash);
            });
        });

        observeActiveSection();
    };

    window.PortfolioNavigation = { init };
})();
