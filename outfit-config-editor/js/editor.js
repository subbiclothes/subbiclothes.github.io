function tristateHTML(field, value) {
  const ya = value === true  ? 'ts-active' : '';
  const no = value === false ? 'ts-active' : '';
  const au = (value === null || value === undefined) ? 'ts-active' : '';
  return `<div class="tristate" data-field="${field}">
    <button class="ts-btn ${ya}" data-val="true"  onclick="setTristate(this)">${t('ts_yes')}</button>
    <button class="ts-btn ${no}" data-val="false" onclick="setTristate(this)">${t('ts_no')}</button>
    <button class="ts-btn ${au}" data-val="auto"  onclick="setTristate(this)">${t('ts_auto')}</button>
  </div>`;
}

function colorFieldHTML(cls, value, hintKey) {
  const hex = slVecToHex(value) || '#ffffff';

  const presetBg = p => {
    const h = slVecToHex(p.value);
    if (h) return `background:${h}`;
    if (p.value === 'Skyblue') return 'background:skyblue';
    if (p.value === 'Rainbow') return 'background:linear-gradient(135deg,#f00,#f80,#ff0,#0f0,#00f,#80f)';
    if (p.value === 'Random')  return 'background:linear-gradient(135deg,#f66,#fa0,#6e6,#6af,#d6d,#fa0)';
    return 'background:linear-gradient(135deg,#f00,#0f0,#00f)';
  };

  const listItems = COLOR_PRESETS.map((p, i) => {
    const active = p.value === value ? 'preset-item-active' : '';
    const sep = i === 3 ? '<div class="preset-item-sep"></div>' : '';
    return `${sep}<div class="preset-item ${active}" data-value="${esc(p.value)}" onclick="pickPreset(this)">
      <span class="preset-item-dot" style="${presetBg(p)}"></span>
      <span>${esc(p.label)}</span>
    </div>`;
  }).join('');

  return `<div class="color-field">
    <div class="color-tabs">
      <button class="ctab active" onclick="switchColorTab(this,'manual')">${t('color_manual')}</button>
      <button class="ctab" onclick="switchColorTab(this,'preset')">${t('color_preset')}</button>
    </div>
    <div class="color-manual-row">
      <input type="color" class="color-swatch" value="${hex}" oninput="syncTextFromSwatch(this)"/>
      <input type="text" class="${cls}" value="${esc(value)}" placeholder="&lt;1.0, 1.0, 1.0&gt;" oninput="syncSwatchFromText(this)"/>
    </div>
    <div class="color-preset-list" style="display:none">${listItems}</div>
    <div class="color-hint">${t(hintKey)}</div>
  </div>`;
}

function renderEditor(id) {
  const o = outfits.find(x => x.id === id);
  if (!o) return;
  const d = o.data;
  document.getElementById('emptyState').style.display = 'none';
  const ec = document.getElementById('editorContainer');
  ec.style.display = '';

  const wip = `<span class="wip-badge">${t('wip')}</span>`;

  const bpRows = BODY_PARTS.map(p => {
    const bp = d.bodyparts[p] || {};
    const def = BP_DEFAULTS[p] || {};
    const en = bp.enabled ? 'checked' : '';
    return `<tr class="bp-row" data-part="${p}">
      <td><div class="bodypart-row-toggle">
        <input type="checkbox" class="row-enable" ${en} data-part="${p}" style="pointer-events:none;"/>
        <span class="part-label">${p}</span>
      </div></td>
      <td><input type="text" class="bp-normal"    data-part="${p}" value="${esc(bp.normal||'')}"      placeholder="${esc(def.normal||'')}"            oninput="updatePartEnabled('${p}')"/></td>
      <td><input type="text" class="bp-underwear" data-part="${p}" value="${esc(bp.underwear||'')}"   placeholder="${esc(def.underwear||'')}"         oninput="updatePartEnabled('${p}')"/></td>
      <td><input type="text" class="bp-wear-anim" data-part="${p}" value="${esc(bp.wear_anim||'')}"   placeholder="${esc(def.wear_anim||'—')}"        oninput="updatePartEnabled('${p}')"/></td>
      <td><input type="number" class="bp-wear-time" data-part="${p}" value="${bp.wear_time??''}"     placeholder="${def.wear_time??1.0}" step="0.1" min="0" oninput="updatePartEnabled('${p}')"/></td>
      <td><input type="text" class="bp-rem-anim"  data-part="${p}" value="${esc(bp.remove_anim||'')}" placeholder="${esc(def.remove_anim||'—')}"      oninput="updatePartEnabled('${p}')"/></td>
      <td><input type="number" class="bp-rem-time"  data-part="${p}" value="${bp.remove_time??''}"   placeholder="${def.remove_time??1.0}" step="0.1" min="0" oninput="updatePartEnabled('${p}')"/></td>
    </tr>`;
  }).join('');

  ec.innerHTML = `
  <div class="outfit-editor" id="editor_${id}">
    <div class="editor-title-row">
      <div>
        <div class="editor-title">${o.avatar} / ${o.name}</div>
        <div class="editor-subtitle" style="font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--text-dim);">"${o.avatar}/${o.name}"</div>
      </div>
      <div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap;">
        <button class="btn btn-ghost btn-sm" onclick="openRenameModal('${id}')">
          <i class="fa-solid fa-pen"></i> ${t('btn_rename')}
        </button>
        <button class="btn btn-ghost btn-sm" onclick="duplicateOutfit('${id}')">
          <i class="fa-solid fa-copy"></i> ${t('btn_duplicate')}
        </button>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteOutfit('${id}')">
          <i class="fa-solid fa-trash"></i> ${t('btn_delete')}
        </button>
      </div>
    </div>

    <!-- SETTINGS -->
    <div class="section" id="sec_settings">
      <div class="section-header" onclick="toggleSection('sec_settings')">
        <i class="fa-solid fa-sliders section-icon"></i>
        <span class="section-label">${t('sec_settings')}</span>
        <i class="fa-solid fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-body">
        <div class="form-grid" style="margin-bottom:16px;">
          <div class="form-group">
            <label>${t('gender')}</label>
            <select class="f-gender">
              <option value="Auto"    ${d.gender==='Auto'||!d.gender?'selected':''}>Auto</option>
              <option value="Neutral" ${d.gender==='Neutral'?'selected':''}>Neutral</option>
              <option value="Female"  ${d.gender==='Female'?'selected':''}>Female</option>
              <option value="Male"    ${d.gender==='Male'?'selected':''}>Male</option>
            </select>
          </div>
          <div class="form-group">
            <label>${t('pg_safe_mode')} ${wip}</label>
            <select class="f-pg-safe">
              <option value="" ${!d.pg_safe_mode?'selected':''}>${t('pg_none')}</option>
              <option value="Dress me"       ${d.pg_safe_mode==='Dress me'?'selected':''}>${t('pg_opt_dress')}</option>
              <option value="Replace Avatar" ${d.pg_safe_mode==='Replace Avatar'?'selected':''}>${t('pg_opt_replace')}</option>
              <option value="Block Nudity"   ${d.pg_safe_mode==='Block Nudity'?'selected':''}>${t('pg_opt_block')}</option>
            </select>
            <div class="toggle-desc">${t('pg_safe_mode_desc')}</div>
          </div>
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('anim_enabled')}</div><div class="toggle-desc">${t('anim_enabled_desc')}</div></div>
          ${tristateHTML('f-anim', d.animations_enabled)}
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('skelfix_change')}</div><div class="toggle-desc">${t('skelfix_change_desc')}</div></div>
          ${tristateHTML('f-skelfix-change', d.skelfix_change)}
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('skelfix_reload')}</div><div class="toggle-desc">${t('skelfix_reload_desc')}</div></div>
          ${tristateHTML('f-skelfix-reload', d.skelfix_reload)}
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('nudity')}</div><div class="toggle-desc">${t('nudity_desc')}</div></div>
          ${tristateHTML('f-nudity', d.nudity_permission)}
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('hairstyle_perm')} ${wip}</div><div class="toggle-desc">${t('hairstyle_perm_desc')}</div></div>
          ${tristateHTML('f-hairstyle', d.hairstyle_permission)}
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('clothes_perm')} ${wip}</div><div class="toggle-desc">${t('clothes_perm_desc')}</div></div>
          ${tristateHTML('f-clothes', d.clothes_permission)}
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('lock_ankles')} ${wip}</div><div class="toggle-desc">${t('lock_ankles_desc')}</div></div>
          ${tristateHTML('f-lock-ankles', d.lock_ankles)}
        </div>
        <p style="font-size:12px;color:var(--text-dim);margin-top:14px;padding:7px 12px;background:var(--pink-soft);border-radius:var(--radius);border:1px solid var(--border);">
          <i class="fa-solid fa-circle-info" style="color:var(--pink);margin-right:5px;"></i>${t('auto_hint')}
        </p>
      </div>
    </div>

    <!-- BODYPARTS -->
    <div class="section" id="sec_bodyparts">
      <div class="section-header" onclick="toggleSection('sec_bodyparts')">
        <i class="fa-solid fa-person section-icon"></i>
        <span class="section-label">${t('sec_bodyparts')}</span>
        <i class="fa-solid fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-body" style="overflow-x:auto;">
        <p style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">
          <i class="fa-solid fa-circle-info" style="color:var(--pink);"></i>
          &nbsp;${t('bodyparts_hint')}
        </p>
        <table class="bodypart-table">
          <thead><tr>
            <th>${t('enabled_parts')}</th>
            <th>${t('col_normal')}</th>
            <th>${t('col_underwear')}</th>
            <th>${t('col_wear_anim')}</th>
            <th>${t('col_wear_time')}</th>
            <th>${t('col_rem_anim')}</th>
            <th>${t('col_rem_time')}</th>
          </tr></thead>
          <tbody>${bpRows}</tbody>
        </table>
        <p style="font-size:12px;color:var(--text-dim);margin-top:12px;padding:7px 12px;background:var(--pink-soft);border-radius:var(--radius);border:1px solid var(--border);">
          <i class="fa-solid fa-circle-info" style="color:var(--pink);margin-right:5px;"></i>${t('footer_hint')}
        </p>
      </div>
    </div>

    <!-- PARTICLES -->
    <div class="section" id="sec_particles">
      <div class="section-header" onclick="toggleSection('sec_particles')">
        <i class="fa-solid fa-wand-magic-sparkles section-icon"></i>
        <span class="section-label">${t('sec_particles')}</span>
        <i class="fa-solid fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-body">
        <div class="toggle-row" style="margin-bottom:14px;">
          <div><div class="toggle-label">${t('particles_enabled')}</div></div>
          ${tristateHTML('f-part-en', d.particles_enabled)}
        </div>
        <div class="form-grid">
          <div class="form-group full">
            <label>${t('particles_texture')}</label>
            <input type="text" class="f-part-tex" value="${esc(d.particles_texture||'')}" placeholder="UUID or inventory item name"/>
          </div>
          <div class="form-group">
            <label>${t('particles_duration')}</label>
            <input type="number" class="f-part-dur" value="${d.particles_duration??0}" step="0.1" min="0"/>
          </div>
          <div></div>
          <div class="form-group">
            <label>${t('particles_color_start')}</label>
            ${colorFieldHTML('f-part-col-start', d.particles_color_start||'<1.0, 1.0, 1.0>', 'particles_color_hint')}
          </div>
          <div class="form-group">
            <label>${t('particles_color_end')}</label>
            ${colorFieldHTML('f-part-col-end', d.particles_color_end||'<1.0, 1.0, 1.0>', 'particles_color_hint')}
          </div>
        </div>
      </div>
    </div>

    <!-- TITLE -->
    <div class="section" id="sec_title">
      <div class="section-header" onclick="toggleSection('sec_title')">
        <i class="fa-solid fa-tag section-icon"></i>
        <span class="section-label">${t('sec_title')}</span>
        <i class="fa-solid fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-body">
        <div class="toggle-row" style="margin-bottom:14px;">
          <div><div class="toggle-label">${t('title_enabled')}</div></div>
          ${tristateHTML('f-title-en', d.title_enabled)}
        </div>
        <div class="form-grid">
          <div class="form-group full">
            <label>${t('title_text')}</label>
            <input type="text" class="f-title-txt" value="${esc(d.title_text||'')}" placeholder="🦆 My Outfit 🦆"/>
            <div class="color-hint">${t('title_text_hint')}</div>
          </div>
          <div class="form-group">
            <label>${t('title_color')}</label>
            ${colorFieldHTML('f-title-col', d.title_color||'<1.0, 1.0, 1.0>', 'particles_color_hint')}
          </div>
        </div>
      </div>
    </div>

  </div>`;
}

function updatePartEnabled(part) {
  const fields = [
    document.querySelector(`.bp-normal[data-part="${part}"]`),
    document.querySelector(`.bp-underwear[data-part="${part}"]`),
    document.querySelector(`.bp-wear-anim[data-part="${part}"]`),
    document.querySelector(`.bp-wear-time[data-part="${part}"]`),
    document.querySelector(`.bp-rem-anim[data-part="${part}"]`),
    document.querySelector(`.bp-rem-time[data-part="${part}"]`)
  ];
  const hasValue = fields.some(f => f && f.value.trim() !== '');
  const cb = document.querySelector(`.row-enable[data-part="${part}"]`);
  if (cb) cb.checked = hasValue;
}

function toggleSection(id) {
  document.getElementById(id).classList.toggle('collapsed');
}

function saveActiveEditor() {
  if (importing) return;
  if (!activeId) return;
  const o = outfits.find(x => x.id === activeId);
  if (!o) return;
  const d = o.data;
  const get = sel => document.querySelector(sel);
  if (!get('.f-gender')) return;

  const getTs = field => {
    const active = document.querySelector(`.tristate[data-field="${field}"] .ts-active`);
    if (!active) return null;
    const v = active.dataset.val;
    return v === 'auto' ? null : v === 'true';
  };
  d.gender               = get('.f-gender').value;
  d.animations_enabled   = getTs('f-anim');
  d.skelfix_change       = getTs('f-skelfix-change');
  d.skelfix_reload       = getTs('f-skelfix-reload');
  d.nudity_permission    = getTs('f-nudity');
  d.hairstyle_permission = getTs('f-hairstyle');
  d.clothes_permission   = getTs('f-clothes');
  d.lock_ankles          = getTs('f-lock-ankles');
  d.pg_safe_mode         = get('.f-pg-safe').value;

  BODY_PARTS.forEach(p => {
    const bp = d.bodyparts[p];
    if (!document.querySelector(`.row-enable[data-part="${p}"]`)) return;
    const wt = (document.querySelector(`.bp-wear-time[data-part="${p}"]`) || {}).value ?? '';
    const rt = (document.querySelector(`.bp-rem-time[data-part="${p}"]`)  || {}).value ?? '';
    bp.normal      = (document.querySelector(`.bp-normal[data-part="${p}"]`)    || {}).value || '';
    bp.underwear   = (document.querySelector(`.bp-underwear[data-part="${p}"]`) || {}).value || '';
    bp.wear_anim   = (document.querySelector(`.bp-wear-anim[data-part="${p}"]`) || {}).value || '';
    bp.wear_time   = wt === '' ? '' : parseFloat(wt);
    bp.remove_anim = (document.querySelector(`.bp-rem-anim[data-part="${p}"]`)  || {}).value || '';
    bp.remove_time = rt === '' ? '' : parseFloat(rt);
    bp.enabled     = !!(bp.normal || bp.underwear || bp.wear_anim || bp.wear_time !== '' || bp.remove_anim || bp.remove_time !== '');
  });

  d.particles_enabled     = getTs('f-part-en');
  d.particles_texture     = get('.f-part-tex').value;
  d.particles_duration    = parseFloat(get('.f-part-dur').value || 0);
  d.particles_color_start = get('.f-part-col-start').value;
  d.particles_color_end   = get('.f-part-col-end').value;
  d.title_enabled      = getTs('f-title-en');
  d.title_text         = get('.f-title-txt').value;
  d.title_color        = get('.f-title-col').value;
}
