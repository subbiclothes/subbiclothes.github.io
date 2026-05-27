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

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
    list.querySelectorAll('.preset-item').forEach(d => {
      d.classList.toggle('preset-item-active', d.dataset.value === inp.value);
    });
  } else {
    list.style.display = 'none';
    row.style.display  = '';
    syncSwatchFromText(inp);
  }
}

function pickPreset(el) {
  const field = el.closest('.color-field');
  const inp   = field.querySelector('input[type=text]');
  inp.value   = el.dataset.value;
  field.querySelectorAll('.preset-item').forEach(d => d.classList.remove('preset-item-active'));
  el.classList.add('preset-item-active');
  syncSwatchFromText(inp);
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
  const swatch = inp.closest('.color-field').querySelector('.color-swatch');
  if (!swatch) return;
  const hex = slVecToHex(inp.value);
  if (hex) swatch.value = hex;
}

function syncTextFromSwatch(swatch) {
  const inp = swatch.closest('.color-field').querySelector('input[type=text]');
  inp.value = hexToSlVec(swatch.value);
}
