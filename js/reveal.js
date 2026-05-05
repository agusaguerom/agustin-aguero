(function () {
    const init = () => {
        const revealItems = document.querySelectorAll("[data-reveal]");
        const staggerItems = document.querySelectorAll(
            ".info-card, .project, .stack-item, .experience-item, .footer__links a"
        );

        staggerItems.forEach((item, index) => {
            item.classList.add("reveal-child");
            item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 80}ms`);
        });

        if (!revealItems.length && !staggerItems.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
            }
        );

        revealItems.forEach((item) => observer.observe(item));
        staggerItems.forEach((item) => observer.observe(item));
    };

    window.PortfolioReveal = { init };
})();
