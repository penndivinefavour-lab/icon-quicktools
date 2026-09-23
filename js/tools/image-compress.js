// Image Compressor/Resizer Tool v1.1 — browser-local processing
(function () {
  const id = 'image-compress';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Compress and resize images locally in your browser. No upload to any server.</p>
      <div class="field">
        <label>Select Image</label>
        <input type="file" id="img-input" accept="image/*" class="input" style="padding:8px" />
      </div>
      <div class="options-row" style="flex-direction:column; align-items:stretch; gap:12px">
        <label class="option" style="justify-content:space-between">
          <span>Quality: <strong id="img-quality-val">70</strong>%</span>
          <input type="range" id="img-quality" min="10" max="100" value="70" style="width:140px" />
        </label>
        <label class="option" style="justify-content:space-between">
          <span>Max Width: <strong id="img-width-val">1200</strong>px</span>
          <input type="range" id="img-width" min="100" max="4000" value="1200" step="100" style="width:140px" />
        </label>
        <label class="option" style="justify-content:space-between">
          <span>Max Height: <strong id="img-height-val">1200</strong>px</span>
          <input type="range" id="img-height" min="100" max="4000" value="1200" step="100" style="width:140px" />
        </label>
        <label class="option"><input type="checkbox" id="img-keep-ratio" checked> Maintain aspect ratio</label>
      </div>
      <div id="img-status" style="margin:8px 0; min-height:20px"></div>
      <div id="img-preview-row" style="display:none">
        <div class="stats-row" style="margin-bottom:12px">
          <div class="stat-box">
            <div class="stat-box-value" id="img-original-size">—</div>
            <div class="stat-box-label">Original</div>
          </div>
          <div class="stat-box">
            <div class="stat-box-value" id="img-compressed-size">—</div>
            <div class="stat-box-label">Compressed</div>
          </div>
          <div class="stat-box">
            <div class="stat-box-value" id="img-savings">—</div>
            <div class="stat-box-label">Savings</div>
          </div>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px">
          <div style="flex:1; min-width:140px">
            <label>Original</label>
            <img id="img-original-preview" style="width:100%; border-radius:8px; border:1px solid var(--border); margin-top:6px" />
          </div>
          <div style="flex:1; min-width:140px">
            <label>Result</label>
            <img id="img-compressed-preview" style="width:100%; border-radius:8px; border:1px solid var(--border); margin-top:6px" />
          </div>
        </div>
      </div>
      <div class="actions">
        <button id="img-process" class="btn btn-primary" disabled>Compress</button>
        <button id="img-download" class="btn btn-secondary" disabled>📥 Download</button>
        <button id="img-reset" class="btn btn-ghost">Reset</button>
      </div>
    `;
    return wrap;
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function onMount(root) {
    const input = root.querySelector('#img-input');
    const processBtn = root.querySelector('#img-process');
    const downloadBtn = root.querySelector('#img-download');
    const statusEl = root.querySelector('#img-status');
    const previewRow = root.querySelector('#img-preview-row');
    const qualityVal = root.querySelector('#img-quality-val');
    const widthVal = root.querySelector('#img-width-val');
    const heightVal = root.querySelector('#img-height-val');
    const qualityInput = root.querySelector('#img-quality');
    const widthInput = root.querySelector('#img-width');
    const heightInput = root.querySelector('#img-height');
    let currentBlob = null;
    let originalFile = null;

    qualityInput.addEventListener('input', () => qualityVal.textContent = qualityInput.value);
    widthInput.addEventListener('input', () => widthVal.textContent = widthInput.value);
    heightInput.addEventListener('input', () => heightVal.textContent = heightInput.value);

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        statusEl.innerHTML = '<span class="badge badge-error">Please select an image file</span>';
        return;
      }
      originalFile = file;
      processBtn.disabled = false;
      statusEl.innerHTML = '<span class="badge badge-success">Ready to compress</span>';
      previewRow.style.display = 'none';
    });

    processBtn.addEventListener('click', () => {
      if (!originalFile) return;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        const maxW = parseInt(widthInput.value, 10);
        const maxH = parseInt(heightInput.value, 10);
        const keepRatio = root.querySelector('#img-keep-ratio').checked;

        if (keepRatio) {
          const ratio = Math.min(maxW / w, maxH / h, 1);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        } else {
          w = Math.min(w, maxW);
          h = Math.min(h, maxH);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const quality = parseInt(qualityInput.value, 10) / 100;
        const format = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';

        canvas.toBlob((blob) => {
          if (!blob) {
            statusEl.innerHTML = '<span class="badge badge-error">Compression failed</span>';
            return;
          }
          currentBlob = blob;
          const url = URL.createObjectURL(blob);
          const origUrl = URL.createObjectURL(originalFile);

          root.querySelector('#img-original-preview').src = origUrl;
          root.querySelector('#img-compressed-preview').src = url;
          root.querySelector('#img-original-size').textContent = formatBytes(originalFile.size);
          root.querySelector('#img-compressed-size').textContent = formatBytes(blob.size);
          const savings = Math.round((1 - blob.size / originalFile.size) * 100);
          root.querySelector('#img-savings').textContent = savings + '%';

          previewRow.style.display = 'block';
          downloadBtn.disabled = false;
          statusEl.innerHTML = `<span class="badge badge-success">Done! ${w}×${h}</span>`;
        }, format, quality);
      };
      img.src = URL.createObjectURL(originalFile);
    });

    downloadBtn.addEventListener('click', () => {
      if (!currentBlob) return;
      const url = URL.createObjectURL(currentBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed-' + (originalFile.name || 'image.jpg');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.App.toast('Downloaded!');
    });

    root.querySelector('#img-reset').addEventListener('click', () => {
      input.value = '';
      processBtn.disabled = true;
      downloadBtn.disabled = true;
      previewRow.style.display = 'none';
      statusEl.innerHTML = '';
      currentBlob = null;
      originalFile = null;
      window.App.toast('Reset');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Image Compress', desc: 'Resize & compress locally', icon: '🖼', category: 'media', render, onMount };
})();
