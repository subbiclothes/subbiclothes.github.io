function encodeColorForOutput(v) {
  if (!v) return v;
  return String(v).replace(/^RGB:(\d+)$/i, (_, n) => 'RGB:' + (parseInt(n) * 12));
}

function decodeColorFromInput(v) {
  if (!v) return v;
  return String(v).replace(/^RGB:(\d+)$/i, (_, n) => {
    const num = parseInt(n);
    return 'RGB:' + (num % 12 === 0 ? num / 12 : num);
  });
}

function encodeTitleText(text, mode, scrollSize) {
  if (!text) return text;
  if (mode === 'sequential') return '#SEQ#' + text;
  if (mode === 'scroll') return `#SCROLL:${scrollSize || 5}#` + text;
  return text;
}

function decodeTitleText(raw) {
  if (!raw) return { text: raw, mode: null, scrollSize: null };
  const seqMatch = /^#SEQ#([\s\S]*)$/.exec(raw);
  if (seqMatch) return { text: seqMatch[1], mode: 'sequential', scrollSize: null };
  const scrollMatch = /^#SCROLL:(\d+)#([\s\S]*)$/.exec(raw);
  if (scrollMatch) return { text: scrollMatch[2], mode: 'scroll', scrollSize: parseInt(scrollMatch[1]) };
  return { text: raw, mode: null, scrollSize: null };
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── GROUPS ── */
function groupName(o) {
  const g = groups.find(x => x.id === o.groupId);
  return g ? g.name : '';
}

function findOrCreateGroupByName(name) {
  name = String(name).trim();
  let g = groups.find(x => x.name === name);
  if (!g) {
    g = { id: 'g_' + Date.now() + '_' + Math.random().toString(36).slice(2,6), name, data: DEFAULT_OUTFIT(), groupTags: '' };
    groups.push(g);
  }
  return g;
}

function notify(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function setTristate(btn) {
  btn.closest('.tristate').querySelectorAll('.ts-btn').forEach(b => b.classList.remove('ts-active'));
  btn.classList.add('ts-active');
}

function setTitleMode(cb, mode) {
  const seqCb    = document.querySelector('.f-title-mode-seq');
  const scrollCb = document.querySelector('.f-title-mode-scroll');
  if (cb.checked) {
    if (mode === 'sequential' && scrollCb) scrollCb.checked = false;
    if (mode === 'scroll' && seqCb) seqCb.checked = false;
  }
  const row = document.getElementById('titleScrollSizeRow');
  if (row) row.style.display = scrollCb && scrollCb.checked ? '' : 'none';
}

function presetSwatchBg(value) {
  const h = slVecToHex(value);
  if (h) return h;
  if (value === 'Skyblue') return 'skyblue';
  if (value === 'Rainbow') return 'linear-gradient(135deg,#f00,#f80,#ff0,#0f0,#00f,#80f)';
  if (value === 'Random')  return 'linear-gradient(135deg,#f66,#fa0,#6e6,#6af,#d6d,#fa0)';
  return 'linear-gradient(135deg,#f00,#0f0,#00f)';
}

function getSpeedRow(field) {
  const id = field.dataset.speedRowId;
  return id ? document.getElementById(id) : null;
}

function setSwatchLocked(field, rawValue) {
  const nativeSwatch = field.querySelector('input.color-swatch');
  const lockSwatch    = field.querySelector('.color-swatch-lock');
  if (nativeSwatch) nativeSwatch.style.display = 'none';
  if (lockSwatch) {
    lockSwatch.style.background = presetSwatchBg(rawValue);
    lockSwatch.style.display = '';
  }
}

function setSwatchUnlocked(field) {
  const nativeSwatch = field.querySelector('input.color-swatch');
  const lockSwatch    = field.querySelector('.color-swatch-lock');
  if (lockSwatch) lockSwatch.style.display = 'none';
  if (nativeSwatch) nativeSwatch.style.display = '';
}

function switchColorTab(btn, mode) {
  const field = btn.closest('.color-field');
  field.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const row  = field.querySelector('.color-manual-row');
  const inp  = field.querySelector('input[type=text]');
  const list = field.querySelector('.color-preset-list');
  if (mode === 'preset') {
    row.style.display  = 'none';
    list.style.display = '';
    const speedRow = getSpeedRow(field);
    if (speedRow) speedRow.style.display = 'none';
    const current = inp.dataset.rawValue || inp.value;
    const currentBase = /^RGB:\d+$/.test(current) ? 'RGB' : current;
    list.querySelectorAll('.preset-item').forEach(d => {
      d.classList.toggle('preset-item-active', d.dataset.value === currentBase);
    });
  } else {
    list.style.display = 'none';
    row.style.display  = '';
    if (inp.dataset.rawValue) {
      inp.value = inp.dataset.rawValue;
      delete inp.dataset.rawValue;
      inp.readOnly = false;
      setSwatchUnlocked(field);
      updateRgbSpeedUI(field, false);
    }
    syncSwatchFromText(inp);
  }
}

function closeColorPresetMenu(field) {
  field.querySelector('.color-preset-list').style.display = 'none';
  field.querySelector('.color-manual-row').style.display  = '';
  field.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  const presetBtn = field.querySelector('.ctab[data-mode="preset"]');
  if (presetBtn) presetBtn.classList.add('active');
}

function pickPreset(el) {
  const field    = el.closest('.color-field');
  const inp      = field.querySelector('input[type=text]');
  const rawValue = el.dataset.value;
  const isRgb    = rawValue === 'RGB';
  const prevRaw  = inp.dataset.rawValue || '';
  const keepSpeed = isRgb && /^RGB:\d+$/.test(prevRaw);
  inp.value            = el.dataset.label;
  inp.dataset.rawValue = isRgb ? (keepSpeed ? prevRaw : 'RGB:10') : rawValue;
  inp.readOnly         = true;
  field.querySelectorAll('.preset-item').forEach(d => d.classList.remove('preset-item-active'));
  el.classList.add('preset-item-active');
  setSwatchLocked(field, rawValue);
  updateRgbSpeedUI(field, isRgb, keepSpeed ? prevRaw : null);
  closeColorPresetMenu(field);
}

function updateRgbSpeedUI(field, show, existingRaw) {
  const row = getSpeedRow(field);
  if (!row) return;
  row.style.display = show ? '' : 'none';
  if (!show) return;
  let n = 10;
  const m = existingRaw ? /^RGB:(\d+)$/.exec(existingRaw) : null;
  if (m) n = parseInt(m[1]);
  let idx = RGB_SPEEDS.findIndex(s => s.n === n);
  if (idx < 0) idx = RGB_SPEEDS.findIndex(s => s.n === 10);
  const range = row.querySelector('.rgb-speed-slider');
  const label = row.querySelector('.rgb-speed-label');
  if (range) range.value = idx;
  if (label) label.textContent = RGB_SPEEDS[idx].label;
}

function onRgbSpeedChange(rangeEl) {
  const row = rangeEl.closest('.rgb-speed-row');
  const cls = row.id.replace(/^rgbSpeedRow_/, '');
  const inp = document.querySelector('.' + cls);
  if (!inp) return;
  const step = RGB_SPEEDS[parseInt(rangeEl.value)];
  inp.dataset.rawValue = 'RGB:' + step.n;
  const label = row.querySelector('.rgb-speed-label');
  if (label) label.textContent = step.label;
}

function colorInputValue(inp) {
  return (inp && inp.dataset.rawValue) || (inp ? inp.value : '');
}

function onColorFieldClick(inp) {
  if (!inp.readOnly) return;
  const field = inp.closest('.color-field');
  const presetBtn = field.querySelector('.ctab[data-mode="preset"]');
  if (presetBtn) switchColorTab(presetBtn, 'preset');
}

function slVecToHex(val) {
  const m = String(val).match(/<\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\s*>/);
  if (!m) return null;
  const toB = v => Math.min(255, Math.round(parseFloat(v) * 255));
  return '#' + [m[1], m[2], m[3]].map(v => toB(v).toString(16).padStart(2, '0')).join('');
}

function hexToSlVec(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `<${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}>`;
}

function syncSwatchFromText(inp) {
  const swatch = inp.closest('.color-field').querySelector('input.color-swatch');
  if (!swatch) return;
  const hex = slVecToHex(inp.value);
  if (hex) swatch.value = hex;
}

function syncTextFromSwatch(swatch) {
  const inp = swatch.closest('.color-field').querySelector('input[type=text]');
  inp.value = hexToSlVec(swatch.value);
  inp.readOnly = false;
  delete inp.dataset.rawValue;
}
