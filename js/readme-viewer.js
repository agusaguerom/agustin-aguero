(function () {
    const setText = (selector, value) => {
        const element = document.querySelector(selector);

        if (element && value) {
            element.textContent = value;
        }
    };

    const renderEmptyState = (project) => `
        <div class="readme-empty">
            <h2>Falta conectar el README</h2>
            <p>Agrega la URL raw del README de GitHub para ${project.title} en <code>js/readme-config.js</code>.</p>
            <p>Formato esperado: <code>https://raw.githubusercontent.com/USUARIO/REPO/main/README.md</code></p>
        </div>
    `;

    const renderErrorState = (project) => `
        <div class="readme-empty">
            <h2>No se pudo cargar el README</h2>
            <p>Revisa que el repositorio sea publico y que la URL del README sea correcta.</p>
            ${project.repoUrl ? `<p><a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">Abrir repo en GitHub</a></p>` : ""}
        </div>
    `;

    const stripReadmeTitle = (markdown) => markdown.replace(/^#\s+.+\r?\n+/, "");

    const getHeadings = (markdown) =>
        markdown
            .split(/\r?\n/)
            .map((line) => line.match(/^#{2,3}\s+(.+)$/))
            .filter(Boolean)
            .slice(0, 6)
            .map((match) => ({
                label: match[1].replace(/[*_`]/g, ""),
                href: `#${window.PortfolioMarkdown.slugify(match[1])}`,
            }));

    const renderStack = (items = []) =>
        items.map((item) => `<span class="case-study__tag">${item}</span>`).join("");

    const renderToc = (headings) => {
        if (!headings.length) {
            return '<p class="case-study__muted">El README no incluye secciones detectables.</p>';
        }

        return headings
            .map((heading) => `<a href="${heading.href}">${heading.label}</a>`)
            .join("");
    };

    const renderCaseStudy = (project, markdown) => {
        const cleanedMarkdown = stripReadmeTitle(markdown);
        const headings = getHeadings(cleanedMarkdown);
        const readmeHtml = window.PortfolioMarkdown.renderMarkdown(cleanedMarkdown);

        return `
            <div class="case-study">
                <aside class="case-study__aside">
                    <div class="case-study__panel">
                        <p class="case-study__label">Rol</p>
                        <p>${project.role || "Desarrollo integral"}</p>
                    </div>
                    <div class="case-study__panel">
                        <p class="case-study__label">Estado</p>
                        <p>${project.status || "Repositorio publico"}</p>
                    </div>
                    <div class="case-study__panel">
                        <p class="case-study__label">Stack / enfoque</p>
                        <div class="case-study__tags">${renderStack(project.stack)}</div>
                    </div>
                    <div class="case-study__panel">
                        <p class="case-study__label">Secciones</p>
                        <nav class="case-study__toc">${renderToc(headings)}</nav>
                    </div>
                    <div class="case-study__actions">
                        ${project.repoUrl ? `<a class="button button--outline button--full" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">Abrir GitHub</a>` : ""}
                    </div>
                </aside>
                <div class="readme-viewer__body">
                    <div class="readme-viewer__intro">
                        <p class="eyebrow">README adaptado</p>
                        <h2>Documentacion del proyecto</h2>
                    </div>
                    ${readmeHtml}
                </div>
            </div>
        `;
    };

    const init = async () => {
        const projectKey = document.body.dataset.readmeProject;
        const project = window.PortfolioReadmes?.[projectKey];
        const content = document.querySelector("[data-readme-content]");

        if (!project || !content) {
            return;
        }

        setText("[data-readme-title]", project.title);
        setText("[data-readme-meta]", project.meta);
        setText("[data-readme-description]", project.description);

        if (!project.readmeUrl) {
            content.innerHTML = renderEmptyState(project);
            return;
        }

        try {
            const response = await fetch(project.readmeUrl);

            if (!response.ok) {
                throw new Error(`README request failed: ${response.status}`);
            }

            const markdown = await response.text();
            content.innerHTML = renderCaseStudy(project, markdown);
        } catch (error) {
            content.innerHTML = renderErrorState(project);
            console.error(error);
        }
    };

    document.addEventListener("DOMContentLoaded", init);
})();
