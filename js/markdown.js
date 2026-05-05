(function () {
    const escapeHtml = (value) =>
        value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const inlineMarkdown = (value) => {
        let html = escapeHtml(value);

        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
            const imageClass = /img\.shields\.io|badge/i.test(src) ? "readme-badge" : "readme-image";
            return `<img alt="${alt}" class="${imageClass}" src="${src}" />`;
        });
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
        html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

        return html;
    };

    const flushList = (state, html) => {
        if (state.inList) {
            html.push("</ul>");
            state.inList = false;
        }
    };

    const slugify = (value) =>
        value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const renderMarkdown = (markdown) => {
        const html = [];
        const state = {
            inCode: false,
            inList: false,
            codeLines: [],
        };

        markdown.split(/\r?\n/).forEach((line) => {
            if (line.trim().startsWith("```")) {
                if (state.inCode) {
                    html.push(`<pre><code>${escapeHtml(state.codeLines.join("\n"))}</code></pre>`);
                    state.codeLines = [];
                    state.inCode = false;
                } else {
                    flushList(state, html);
                    state.inCode = true;
                }

                return;
            }

            if (state.inCode) {
                state.codeLines.push(line);
                return;
            }

            if (!line.trim()) {
                flushList(state, html);
                return;
            }

            const heading = line.match(/^(#{1,4})\s+(.+)$/);

            if (heading) {
                flushList(state, html);
                const level = heading[1].length;
                const id = slugify(heading[2]);
                html.push(`<h${level} id="${id}">${inlineMarkdown(heading[2])}</h${level}>`);
                return;
            }

            const listItem = line.match(/^\s*[-*]\s+(.+)$/);

            if (listItem) {
                if (!state.inList) {
                    html.push("<ul>");
                    state.inList = true;
                }

                html.push(`<li>${inlineMarkdown(listItem[1])}</li>`);
                return;
            }

            flushList(state, html);
            html.push(`<p>${inlineMarkdown(line)}</p>`);
        });

        flushList(state, html);

        return html.join("");
    };

    window.PortfolioMarkdown = { renderMarkdown, slugify };
})();
