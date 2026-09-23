// ICON QuickTools - Main Application
(function () {
  'use strict';

  // --- Tool Registry ---
  const TOOLS = [
    {
      id: 'text-cleaner',
      name: 'Text Cleaner',
      desc: 'Fix whitespace & case',
      icon: 'Aa',
      category: 'text',
      tag: 'Text',
    },
    {
      id: 'counter',
      name: 'Word Counter',
      desc: 'Words, chars, lines',
      icon: '#',
      category: 'text',
      tag: 'Text',
    },
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      desc: 'Pretty-print & validate',
      icon: '{ }',
      category: 'dev',
      tag: 'Dev',
    },
    {
      id: 'url-coder',
      name: 'URL Encoder',
      desc: 'Encode / decode URLs',
      icon: '%',
      category: 'dev',
      tag: 'Dev',
    },
    {
      id: 'base64',
      name: 'Base64',
      desc: 'Encode & decode',
      icon: 'B64',
      category: 'dev',
      tag: 'Dev',
    },
    {
      id: 'password-gen',
      name: 'Password Gen',
      desc: 'Strong passwords',
      icon: '***',
      category: 'security',
      tag: 'Security',
    },
    {
      id: 'uuid-gen',
      name: 'UUID Generator',
      desc: 'Random UUIDs / GUIDs',
      icon: 'ID',
      category: 'dev',
      tag: 'Dev',
    },
    {
      id: 'timestamp',
      name: 'Timestamp',
      desc: 'Epoch ↔ Date',
      icon: 'T',
      category: 'dev',
      tag: 'Dev',
    },
    {
      id: 'color-converter',
      name: 'Color Picker',
      desc: 'HEX / RGB / HSL',
      icon: '◉',
      category: 'design',
      tag: 'Design',
    },
    {
      id: 'qr-generator',
      name: 'QR Code',
      desc: 'Generate QR codes',
      icon: '▦',
      category: 'dev',
      tag: 'Dev',
    },
  ];

  const CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'text', name: 'Text' },
    { id: 'dev', name: 'Dev' },
    { id: 'security', name: 'Security' },
    { id: 'design', name: 'Design' },
  ];

  let currentCategory = 'all';
  let searchQuery = '';

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

    $toolTitle.textContent = tool.name;
    $toolIcon.textContent = tool.icon;
    $toolBody.innerHTML = '';

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
    navigator.clipboard.writeText(text).then(
      () => toast((label || 'Copied') + '!'),
      () => {
        // Fallback for non-HTTPS
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
      chip.textContent = cat.name;
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

    const filtered = TOOLS.filter(t => {
      const catMatch = currentCategory === 'all' || t.category === currentCategory;
      const searchMatch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });

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
      card.className = 'tool-card';
      card.innerHTML =
        '<div class="tool-card-icon">' +
        tool.icon +
        '</div><div class="tool-card-name">' +
        tool.name +
        '</div><div class="tool-card-desc">' +
        tool.desc +
        '</div><span class="tool-card-tag">' +
        tool.tag +
        '</span>';
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
