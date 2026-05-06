(function () {
    /**
     * Navigation Logic: ScrollSpy con IntersectionObserver
     * Detecta qué sección está activa y actualiza el sidebar.
     */
    const navLinks = document.querySelectorAll("[data-nav-link]");
    const sections = document.querySelectorAll("[data-section]");
    const ACTIVE_CLASS = "side-nav__link--active";

    if (!navLinks.length || !sections.length) return;

    // Configuramos el observador para que detecte la sección cuando cruza 
    // una franja horizontal cerca de la parte superior del viewport (25%).
    const observerOptions = {
        root: null,
        rootMargin: "-25% 0px -70% 0px",
        threshold: 0,
    };

    const observerCallback = (entries) => {
        entries.forEach((entry) => {
            // Solo actuamos cuando la sección entra en el área de escaneo
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                const targetLink = document.querySelector(`[data-nav-link][href="#${id}"]`);

                // Si la sección tiene un enlace directo en el menú lateral
                if (targetLink) {
                    // Quitamos la clase activa de todos los enlaces
                    navLinks.forEach((link) => link.classList.remove(ACTIVE_CLASS));
                    // La añadimos al enlace de la sección actual
                    targetLink.classList.add(ACTIVE_CLASS);
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Iniciamos la observación en todas las secciones con data-section
    sections.forEach((section) => {
        if (section.id) {
            observer.observe(section);
        }
    });
})();