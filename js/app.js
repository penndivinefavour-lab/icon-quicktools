// ICON QuickTools - Main Application v1.1
(function () {
  'use strict';

  // --- Tool Registry ---
  const TOOLS = [
    // Text
    { id: 'text-cleaner', name: 'Text Cleaner', desc: 'Fix whitespace & case', icon: 'Aa', category: 'text', tag: 'Text' },
    { id: 'counter', name: 'Word Counter', desc: 'Words, chars, lines', icon: '#', category: 'text', tag: 'Text' },
    { id: 'markdown-preview', name: 'Markdown Preview', desc: 'Write & preview Markdown', icon: 'MD', category: 'text', tag: 'Text' },
    // Developer
    { id: 'json-formatter', name: 'JSON Formatter', desc: 'Pretty-print & validate', icon: '{ }', category: 'developer', tag: 'Dev' },
    { id: 'url-coder', name: 'URL Encoder', desc: 'Encode / decode URLs', icon: '%', category: 'developer', tag: 'Dev' },
    { id: 'base64', name: 'Base64', desc: 'Encode & decode', icon: 'B64', category: 'developer', tag: 'Dev' },
    { id: 'regex-tester', name: 'Regex Tester', desc: 'Test regex patterns', icon: '.*', category: 'developer', tag: 'Dev' },
    { id: 'text-diff', name: 'Text Diff', desc: 'Compare two texts', icon: '±', category: 'developer', tag: 'Dev' },
    // Data
    { id: 'csv-json', name: 'CSV ↔ JSON', desc: 'Convert between formats', icon: '⇄', category: 'data', tag: 'Data' },
    { id: 'timestamp', name: 'Timestamp', desc: 'Epoch ↔ Date', icon: 'T', category: 'data', tag: 'Data' },
    // Security
    { id: 'password-gen', name: 'Password Gen', desc: 'Strong passwords (crypto-secure)', icon: '***', category: 'security', tag: 'Security' },
    { id: 'uuid-gen', name: 'UUID Generator', desc: 'Random UUIDs / GUIDs', icon: 'ID', category: 'security', tag: 'Security' },
    { id: 'hash-gen', name: 'Hash Generator', desc: 'SHA-1/256/384/512', icon: '#', category: 'security', tag: 'Security' },
    { id: 'jwt-decode', name: 'JWT Decoder', desc: 'Decode JWT header & payload', icon: 'JWT', category: 'security', tag: 'Security' },
    // Media
    { id: 'image-compress', name: 'Image Compress', desc: 'Resize & compress locally', icon: '🖼', category: 'media', tag: 'Media' },
    { id: 'qr-generator', name: 'QR Code', desc: 'Generate QR codes', icon: '▦', category: 'media', tag: 'Media' },
    // Utilities
    { id: 'color-converter', name: 'Color Converter', desc: 'HEX / RGB / HSL', icon: '◉', category: 'utilities', tag: 'Utils' },
  ];

  const CATEGORIES = [
    { id: 'all', name: 'All', icon: '◯' },
    { id: 'text', name: 'Text', icon: 'Aa' },
    { id: 'developer', name: 'Developer', icon: '{ }' },
    { id: 'data', name: 'Data', icon: '⇄' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'media', name: 'Media', icon: '🖼' },
    { id: 'utilities', name: 'Utilities', icon: '◉' },
  ];

  let currentCategory = 'all';
  let searchQuery = '';
  let favorites = JSON.parse(localStorage.getItem('qt-favorites') || '[]');
  let recentlyUsed = JSON.parse(localStorage.getItem('qt-recently-used') || '[]');

  // --- DOM ---
  const $homeScreen = document.getElementById('home-screen');
  const $toolScreen = document.getElementById('tool-screen');
  const $aboutScreen = document.getElementById('about-screen');
  const $toolsGrid = document.getElementById('tools-grid');
  const $categoryFilters = document.getElementById('category-filters');
  const $searchInput = document.getElementById('search-input');
  const $toolBody = document.getElementById('tool-body');
  const $toolTitle = document.getElementById('tool-title');
  const $toolIcon = document.getElementById('tool-icon');
  const $statCount = document.getElementById('stat-count');

  // --- Toast ---
  function toast(msg, type = '') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2100);
  }

  // --- Favorites ---
  function toggleFavorite(toolId) {
    const idx = favorites.indexOf(toolId);
    if (idx >= 0) {
      favorites.splice(idx, 1);
      toast('Removed from favorites');
    } else {
      favorites.unshift(toolId);
      toast('Added to favorites!', 'success');
    }
    localStorage.setItem('qt-favorites', JSON.stringify(favorites));
  }

  function isFavorite(toolId) {
    return favorites.includes(toolId);
  }

  // --- Recently Used ---
  function addToRecentlyUsed(toolId) {
    recentlyUsed = [toolId, ...recentlyUsed.filter(id => id !== toolId)].slice(0, 6);
    localStorage.setItem('qt-recently-used', JSON.stringify(recentlyUsed));
  }

  // --- Screen Navigation ---
  function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
    window.scrollTo(0, 0);
  }

  function goHome() {
    showScreen($homeScreen);
    history.replaceState(null, '', '#');
  }

  function openTool(toolId) {
    const tool = window.ToolRegistry && window.ToolRegistry[toolId];
    if (!tool) return;

    addToRecentlyUsed(toolId);

    $toolTitle.textContent = tool.name;
    $toolIcon.textContent = tool.icon;
    $toolBody.innerHTML = '';

    // Update favorites button in header
    const favBtn = document.getElementById('fav-btn');
    if (favBtn) {
      function updateFavBtn() {
        const fav = isFavorite(toolId);
        favBtn.innerHTML = fav ? '★' : '☆';
        favBtn.title = fav ? 'Remove from favorites' : 'Add to favorites';
        favBtn.setAttribute('aria-pressed', fav ? 'true' : 'false');
      }
      updateFavBtn();
      favBtn.onclick = () => {
        toggleFavorite(toolId);
        updateFavBtn();
        if (currentCategory === 'all') renderTools();
      };
    }

    // Build tool content
    const content = tool.render();
    $toolBody.appendChild(content);

    // Setup events
    if (tool.onMount) tool.onMount($toolBody);

    showScreen($toolScreen);
    history.pushState(null, '', '#' + toolId);
  }

  function openAbout() {
    $statCount.textContent = TOOLS.length;
    showScreen($aboutScreen);
    history.pushState(null, '', '#about');
  }

  // --- Copy / Download / Reset ---
  function copyText(text, label) {
    if (!text) {
      toast('Nothing to copy', 'error');
      return;
    }
    if (navigator.share && navigator.canShare && navigator.canShare({ text })) {
      navigator.share({ text }).catch(() => {});
    }
    navigator.clipboard.writeText(text).then(
      () => toast((label || 'Copied') + '!'),
      () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast((label || 'Copied') + '!');
      }
    );
  }

  function downloadText(text, filename, type) {
    const mime = type || 'text/plain';
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('Downloaded!');
  }

  // --- Render Home ---
  function renderCategories() {
    $categoryFilters.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = 'cat-chip' + (cat.id === currentCategory ? ' active' : '');
      chip.innerHTML = '<span class="cat-chip-icon">' + (cat.icon || '') + '</span> ' + cat.name;
      chip.setAttribute('role', 'tab');
      chip.setAttribute('aria-selected', cat.id === currentCategory);
      chip.addEventListener('click', () => {
        currentCategory = cat.id;
        renderCategories();
        renderTools();
      });
      $categoryFilters.appendChild(chip);
    });
  }

  function renderTools() {
    $toolsGrid.innerHTML = '';
    const q = searchQuery.toLowerCase().trim();

    let filtered = TOOLS.filter(t => {
      const catMatch = currentCategory === 'all' || t.category === currentCategory;
      const searchMatch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });

    // Show favorites first if on "all" with no search
    if (currentCategory === 'all' && !q) {
      const favTools = filtered.filter(t => isFavorite(t.id));
      const restTools = filtered.filter(t => !isFavorite(t.id));
      filtered = [...favTools, ...restTools];
    }

    if (filtered.length === 0) {
      const nr = document.createElement('div');
      nr.className = 'no-results';
      nr.innerHTML =
        '<div class="no-results-icon">🔍</div><h3>No tools found</h3><p>Try a different search or category.</p>';
      $toolsGrid.appendChild(nr);
      return;
    }

    filtered.forEach(tool => {
      const card = document.createElement('button');
      card.className = 'tool-card' + (isFavorite(tool.id) ? ' tool-card-fav' : '');
      card.innerHTML =
        '<div class="tool-card-icon">' + tool.icon + '</div>' +
        '<div class="tool-card-name">' + tool.name + '</div>' +
        '<div class="tool-card-desc">' + tool.desc + '</div>' +
        '<span class="tool-card-tag">' + (isFavorite(tool.id) ? '★ ' : '') + tool.tag + '</span>';
      card.addEventListener('click', () => openTool(tool.id));
      $toolsGrid.appendChild(card);
    });
  }

  // --- Search ---
  $searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderTools();
  });

  // --- Navigation Buttons ---
  document.getElementById('about-btn').addEventListener('click', openAbout);
  document.getElementById('about-back-btn').addEventListener('click', goHome);
  document.getElementById('back-btn').addEventListener('click', goHome);

  // --- Handle deep links / back ---
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (!hash || hash === '') goHome();
    else if (hash === 'about') openAbout();
    else openTool(hash);
  });

  // --- Init ---
  window.App = {
    toast,
    copyText,
    downloadText,
    openTool,
    goHome,
    toggleFavorite,
  };

  renderCategories();
  renderTools();

  // Handle initial deep link
  const hash = window.location.hash.slice(1);
  if (hash && hash !== 'about') {
    openTool(hash);
  } else if (hash === 'about') {
    openAbout();
  }
})();
