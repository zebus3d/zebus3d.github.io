const pageIds = ['primeros', 'gc', 'generaciones', 'bootloader', 'flakes', 'hibrida', 'actualizar', 'paquetes', 'automatizacion', 'extras', 'hardware'];
const pageIcons = { primeros: '🚀', gc: '🧹', generaciones: '🗑️', bootloader: '🔧', flakes: '❄️', hibrida: '🔀', actualizar: '🔄', paquetes: '📦', automatizacion: '⚙️', extras: '🧩', hardware: '🖥️' };
const pageLabels = { primeros: 'Primeros Pasos', gc: 'GC', generaciones: 'Generaciones', bootloader: 'Bootloader', flakes: 'Flakes', hibrida: 'Config Híbrida', actualizar: 'Actualizar', paquetes: 'Paquetes', automatizacion: 'Automatizar', extras: 'Extras', hardware: 'Hardware' };

let currentPage = 'primeros';
let pageCache = {};
let searchIndex = [];

function showPage(id) {
    if (!pageIds.includes(id)) id = 'primeros';
    currentPage = id;

    history.replaceState(null, null, '#' + id);

    const content = document.getElementById('content');
    content.style.animation = 'none';
    content.offsetHeight;
    content.style.animation = 'page-in 0.3s ease';

    if (pageCache[id]) {
        content.innerHTML = pageCache[id];
        initPageEvents();
    } else {
        fetch(`pages/${id}.html`)
            .then(r => r.text())
            .then(html => {
                pageCache[id] = html;
                content.innerHTML = html;
                initPageEvents();
            });
    }

    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.page === id);
    });

    updateDots();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initPageEvents() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('pageDots');
    
    if (dotsContainer && dotsContainer.children.length === 0) {
        pageIds.forEach(id => {
            const dot = document.createElement('button');
            dot.className = 'page-dot';
            dot.dataset.page = id;
            dot.title = pageLabels[id] || id;
            dot.addEventListener('click', () => showPage(id));
            dotsContainer.appendChild(dot);
        });
    }
    
    updateNavButtons();
    initCopyButtons();
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const idx = pageIds.indexOf(currentPage);
    
    if (prevBtn) {
        prevBtn.onclick = () => idx > 0 && showPage(pageIds[idx - 1]);
        prevBtn.classList.toggle('disabled', idx <= 0);
    }
    if (nextBtn) {
        nextBtn.onclick = () => idx < pageIds.length - 1 && showPage(pageIds[idx + 1]);
        nextBtn.classList.toggle('disabled', idx >= pageIds.length - 1);
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
});

function updateDots() {
    document.querySelectorAll('.page-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.page === currentPage);
    });
    updateNavButtons();
}

function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        const existing = btn.querySelector('svg');
        if (existing) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'Copiar al portapapeles';
        document.body.appendChild(tooltip);

        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const tooltipHeight = 35;
            const btnCenter = rect.top + (rect.height / 2);
            tooltip.style.left = (rect.left + (rect.width / 2)) + 'px';
            tooltip.style.top = (btnCenter - (tooltipHeight / 2) - 25) + 'px';
            tooltip.classList.add('visible');
        });

        btn.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        btn.onclick = () => {
            const block = btn.closest('.code-block, .gc-code');
            const codeEl = block.querySelector('code, pre');
            const text = codeEl.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove('copied');
                }, 2000);
            });
            tooltip.classList.remove('visible');
        };
    });
}

document.addEventListener('keydown', (e) => {
    const idx = pageIds.indexOf(currentPage);
    if (e.key === 'ArrowRight' && idx < pageIds.length - 1) showPage(pageIds[idx + 1]);
    if (e.key === 'ArrowLeft' && idx > 0) showPage(pageIds[idx - 1]);
});

const stickyNav = document.querySelector('.sticky-nav');
window.addEventListener('scroll', () => {
    stickyNav.classList.toggle('stuck', window.scrollY > 10);
});

function buildSearchIndex() {
    pageIds.forEach(id => {
        if (!pageCache[id]) return;
        const div = document.createElement('div');
        div.innerHTML = pageCache[id];
        const blocks = div.querySelectorAll('h2, h3, .card-title, .card-desc, .gc-title, .gc-desc, .gc-label, .intro-box p, .info-box p, .warning-box p, .critical-box p, code, pre');
        blocks.forEach(block => {
            const text = block.textContent.trim();
            if (text.length > 3) {
                searchIndex.push({ pageId: id, text: text.toLowerCase(), original: text });
            }
        });
    });
}

function ensureIndexBuilt() {
    if (searchIndex.length > 0) return;
    if (Object.keys(pageCache).length < pageIds.length) return;
    buildSearchIndex();
}

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
let selectedIndex = -1;

searchInput.addEventListener('input', () => {
    ensureIndexBuilt();
    const query = searchInput.value.trim().toLowerCase();
    selectedIndex = -1;
    if (!query) { searchResults.classList.remove('open'); return; }

    const words = query.split(/\s+/).filter(w => w.length > 0);
    const matches = [];
    const seen = new Set();

    searchIndex.forEach(entry => {
        const allMatch = words.every(w => entry.text.includes(w));
        if (allMatch && !seen.has(entry.pageId + '|' + entry.text.substring(0, 60))) {
            seen.add(entry.pageId + '|' + entry.text.substring(0, 60));
            let score = 0;
            words.forEach(w => { const idx = entry.text.indexOf(w); if (idx !== -1) score += w.length; });
            matches.push({ ...entry, score });
        }
    });

    matches.sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">Sin resultados</div>';
        searchResults.classList.add('open');
        return;
    }

    searchResults.innerHTML = matches.slice(0, 12).map((m, i) => {
        let display = escapeHtml(m.original);
        words.forEach(w => {
            const regex = new RegExp(`(${escapeRegex(w)})`, 'gi');
            display = display.replace(regex, '<mark>$1</mark>');
        });
        return `<div class="search-result" data-page="${m.pageId}" data-index="${i}">
            <span class="search-result-icon">${pageIcons[m.pageId] || '📄'}</span>
            <span class="search-result-page">${pageLabels[m.pageId] || m.pageId}</span>
            <span class="search-result-text">${display}</span>
        </div>`;
    }).join('');

    searchResults.classList.add('open');

    searchResults.querySelectorAll('.search-result').forEach(el => {
        el.onclick = () => {
            clearHighlights();
            showPage(el.dataset.page);
            highlightText(searchInput.value.trim());
            searchResults.classList.remove('open');
            searchInput.blur();
        };
        el.addEventListener('mouseenter', () => {
            searchResults.querySelectorAll('.search-result').forEach(r => r.classList.remove('selected'));
            el.classList.add('selected');
            selectedIndex = parseInt(el.dataset.index);
        });
    });
});

searchInput.addEventListener('keydown', (e) => {
    const items = searchResults.querySelectorAll('.search-result');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        items.forEach(r => r.classList.remove('selected'));
        items[selectedIndex]?.classList.add('selected');
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        items.forEach(r => r.classList.remove('selected'));
        items[selectedIndex]?.classList.add('selected');
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        items[selectedIndex]?.click();
    } else if (e.key === 'Escape') {
        searchResults.classList.remove('open');
        searchInput.blur();
    }
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
        searchResults.classList.remove('open');
    }
});

function highlightText(query) {
    if (!query) return;
    const page = document.getElementById('content');
    if (!page) return;
    const words = query.split(/\s+/).filter(w => w.length > 1);
    if (!words.length) return;

    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            if (node.parentElement.closest('.search-results, .search-bar, script, style')) return NodeFilter.FILTER_REJECT;
            const text = node.textContent.toLowerCase();
            return words.some(w => text.includes(w)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(textNode => {
        const text = textNode.textContent;
        let html = escapeHtml(text);
        words.forEach(w => {
            const regex = new RegExp(`(${escapeRegex(w)})`, 'gi');
            html = html.replace(regex, '<span class="search-highlight">$1</span>');
        });
        if (html !== escapeHtml(text)) {
            const span = document.createElement('span');
            span.innerHTML = html;
            textNode.parentNode.replaceChild(span, textNode);
        }
    });

    const first = page.querySelector('.search-highlight');
    if (first) {
        setTimeout(() => first.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
}

function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const initHash = window.location.hash.slice(1);
showPage(pageIds.includes(initHash) ? initHash : 'primeros');