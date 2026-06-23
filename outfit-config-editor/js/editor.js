function applyBtn(field) {
  return `<button class="apply-all-btn" title="${t('apply_to_all')}" onclick="showApplyMenu(event,'${field}')"><i class="fa-solid fa-angles-right"></i></button>`;
}

let _applyField = null;

function showApplyMenu(e, fieldKey) {
  e.stopPropagation();
  saveActiveEditor();
  const src = outfits.find(x => x.id === activeId);
  if (!src) return;
  _applyField = fieldKey;
  const gCount = outfits.filter(o => o.avatar === src.avatar && o.id !== src.id).length;
  const aCount = outfits.filter(o => o.id !== src.id).length;
  const menu = document.getElementById('applyMenuPopup');
  document.getElementById('applyMenuGroup').innerHTML = `<i class="fa-solid fa-users"></i> ${src.avatar} <span class="apply-count">(${gCount})</span>`;
  document.getElementById('applyMenuAll').innerHTML = `<i class="fa-solid fa-layer-group"></i> ${t('all_outfits')} <span class="apply-count">(${aCount})</span>`;
  const panel = document.getElementById('mainPanel');
  const panelRect = panel.getBoundingClientRect();
  const rect = e.currentTarget.getBoundingClientRect();
  if (menu.parentElement !== panel) panel.appendChild(menu);
  menu.style.top  = (rect.bottom - panelRect.top + panel.scrollTop + 6) + 'px';
  menu.style.left = Math.min(rect.left - panelRect.left, panel.clientWidth - 230) + 'px';
  menu.classList.add('open');
}

function closeApplyMenu() {
  const menu = document.getElementById('applyMenuPopup');
  if (menu) menu.classList.remove('open');
  _applyField = null;
}

function applyToOutfits(toGroup) {
  if (!_applyField || !activeId) return;
  const src = outfits.find(x => x.id === activeId);
  if (!src) return;
  const val = src.data[_applyField];
  const targets = toGroup
    ? outfits.filter(o => o.avatar === src.avatar && o.id !== src.id)
    : outfits.filter(o => o.id !== src.id);
  targets.forEach(o => { o.data[_applyField] = val; });
  saveToStorage();
  notify(t('applied_n').replace('{n}', targets.length));
  closeApplyMenu();
}

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
        <button class="btn btn-ghost btn-sm" onclick="copyOutfitConfig('${id}')">
          <i class="fa-solid fa-code"></i> ${t('copy_outfit')}
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
            <div style="display:flex;gap:5px;align-items:center;">
              <select class="f-gender" style="flex:1;">
                <option value="Auto"    ${d.gender==='Auto'||!d.gender?'selected':''}>${t('gender_auto')}</option>
                <option value="Neutral" ${d.gender==='Neutral'?'selected':''}>${t('gender_neutral')}</option>
                <option value="Female"  ${d.gender==='Female'?'selected':''}>${t('gender_female')}</option>
                <option value="Male"    ${d.gender==='Male'?'selected':''}>${t('gender_male')}</option>
              </select>
              ${applyBtn('gender')}
            </div>
            <div class="toggle-desc">${t('gender_desc')}</div>
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
          <div style="display:flex;align-items:center;gap:5px;">${applyBtn('animations_enabled')}${tristateHTML('f-anim', d.animations_enabled)}</div>
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('skelfix_change')}</div><div class="toggle-desc">${t('skelfix_change_desc')}</div></div>
          <div style="display:flex;align-items:center;gap:5px;">${applyBtn('skelfix_change')}${tristateHTML('f-skelfix-change', d.skelfix_change)}</div>
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('skelfix_reload')}</div><div class="toggle-desc">${t('skelfix_reload_desc')}</div></div>
          <div style="display:flex;align-items:center;gap:5px;">${applyBtn('skelfix_reload')}${tristateHTML('f-skelfix-reload', d.skelfix_reload)}</div>
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('nudity')}</div><div class="toggle-desc">${t('nudity_desc')}</div></div>
          <div style="display:flex;align-items:center;gap:5px;">${applyBtn('nudity_permission')}${tristateHTML('f-nudity', d.nudity_permission)}</div>
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('hairstyle_perm')} ${wip}</div><div class="toggle-desc">${t('hairstyle_perm_desc')}</div></div>
          <div style="display:flex;align-items:center;gap:5px;">${applyBtn('hairstyle_permission')}${tristateHTML('f-hairstyle', d.hairstyle_permission)}</div>
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('clothes_perm')} ${wip}</div><div class="toggle-desc">${t('clothes_perm_desc')}</div></div>
          <div style="display:flex;align-items:center;gap:5px;">${applyBtn('clothes_permission')}${tristateHTML('f-clothes', d.clothes_permission)}</div>
        </div>
        <div class="toggle-row">
          <div><div class="toggle-label">${t('lock_ankles')} ${wip}</div><div class="toggle-desc">${t('lock_ankles_desc')}</div></div>
          <div style="display:flex;align-items:center;gap:5px;">${applyBtn('lock_ankles')}${tristateHTML('f-lock-ankles', d.lock_ankles)}</div>
        </div>
        <p class="editor-hint editor-hint-bare" style="margin-top:14px;">
          <i class="fa-solid fa-circle-info"></i>&nbsp;${t('auto_hint')}
        </p>
      </div>
    </div>

    <!-- TAGS -->
    <div class="section" id="sec_tags">
      <div class="section-header" onclick="toggleSection('sec_tags')">
        <i class="fa-solid fa-tags section-icon"></i>
        <span class="section-label">${t('sec_tags')}</span>
        <i class="fa-solid fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-body">
        <div style="display:flex;gap:6px;align-items:center;">
          <div style="flex:1;position:relative;">
            <div class="tag-input-wrap" id="tagWrap_${id}">
              <input type="text" class="tag-text-input" id="tagInput_${id}" autocomplete="off" spellcheck="false"/>
            </div>
            <input type="hidden" class="f-tags" id="tagHidden_${id}" value="${esc(d.tags||'')}"/>
            <div class="tag-ac-dropdown" id="tagAc_${id}" style="display:none;"></div>
          </div>
          <button class="btn btn-ghost btn-sm tag-add-btn" id="tagAddBtn_${id}" type="button" title="Add existing tag"><i class="fa-solid fa-plus"></i></button>
        </div>
        <div class="toggle-desc" style="margin-top:6px;">${t('tags_desc')}</div>
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
        <p class="editor-hint editor-hint-bare" style="margin-bottom:10px;">
          <i class="fa-solid fa-circle-info"></i>&nbsp;${t('bodyparts_hint')}
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
        <details class="tip-box" style="margin-top:12px;">
          <summary><i class="fa-solid fa-circle-info tip-icon"></i>${t('footer_hint_summary')}</summary>
          <div class="tip-content">${t('footer_hint')}</div>
        </details>
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
            <input type="text" class="f-part-tex" value="${esc(d.particles_texture||'')}" placeholder="UUID or inventory item name (empty = auto)"/>
          </div>
          <div class="form-group">
            <label>${t('particles_duration')}</label>
            <input type="number" class="f-part-dur" value="${d.particles_duration??''}" placeholder="2" step="1" min="0"/>
          </div>
        </div>
        <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:12px 20px;">
          <div>
            <div class="toggle-row" style="padding:4px 0 8px;border-bottom:none;">
              <div><div class="toggle-label">${t('particles_color_start')}</div></div>
              <label class="toggle"><input type="checkbox" class="f-part-col-start-en" ${d.particles_color_start_enabled ? 'checked' : ''} onchange="toggleColorEnable(this,'partColStartFields');gateColorEnd(this)"><span class="toggle-track"></span></label>
            </div>
            <div id="partColStartFields" style="${d.particles_color_start_enabled ? '' : 'opacity:0.35;pointer-events:none;'}">
              ${colorFieldHTML('f-part-col-start', d.particles_color_start||'<1.0, 1.0, 1.0>', 'particles_color_hint')}
            </div>
          </div>
          <div>
            <div class="toggle-row" style="padding:4px 0 8px;border-bottom:none;">
              <div><div class="toggle-label">${t('particles_color_end')}</div></div>
              <label class="toggle" id="partColEndToggle" style="${!d.particles_color_start_enabled ? 'opacity:0.4;pointer-events:none;' : ''}"><input type="checkbox" class="f-part-col-end-en" ${d.particles_color_end_enabled ? 'checked' : ''} ${!d.particles_color_start_enabled ? 'disabled' : ''} onchange="toggleColorEnable(this,'partColEndFields')"><span class="toggle-track"></span></label>
            </div>
            <div id="partColEndFields" style="${d.particles_color_end_enabled ? '' : 'opacity:0.35;pointer-events:none;'}">
              ${colorFieldHTML('f-part-col-end', d.particles_color_end||'<1.0, 1.0, 1.0>', 'particles_color_hint')}
            </div>
          </div>
        </div>
        <div class="section collapsed" id="sec_part_adv" style="margin-top:16px;">
          <div class="section-header" onclick="toggleSection('sec_part_adv')">
            <i class="fa-solid fa-flask section-icon"></i>
            <span class="section-label">${t('sec_particles_adv')} ${wip}</span>
            <i class="fa-solid fa-chevron-down section-chevron"></i>
          </div>
          <div class="section-body">
            <div class="form-grid" style="margin-bottom:12px;">
              <div class="form-group">
                <label>${t('adv_radius')}</label>
                <input type="number" class="adv-input f-part-radius" value="${d.particles_radius??''}" placeholder="0.5" step="0.1" min="0.1" max="1.0" onblur="clampAdv(this,0.1,1.0)"/>
                <div class="color-hint">Min: 0.1 · Max: 1.0 · Default: 0.5</div>
              </div>
            </div>
            <div class="form-grid" style="margin-bottom:12px;">
              <div class="form-group">
                <label>${t('adv_alpha_start')}</label>
                <input type="number" class="adv-input f-part-alpha-start" value="${d.particles_alpha_start??''}" placeholder="0.8" step="0.1" min="0" max="1.0" onblur="clampAdv(this,0,1.0)"/>
                <div class="color-hint">Min: 0.0 · Max: 1.0 · Default: 0.8</div>
              </div>
              <div class="form-group">
                <label>${t('adv_alpha_end')}</label>
                <input type="number" class="adv-input f-part-alpha-end" value="${d.particles_alpha_end??''}" placeholder="1.0" step="0.1" min="0" max="1.0" onblur="clampAdv(this,0,1.0)"/>
                <div class="color-hint">Min: 0.0 · Max: 1.0 · Default: 1.0</div>
              </div>
            </div>
            <div class="form-grid" style="margin-bottom:12px;">
              <div class="form-group">
                <label>${t('adv_glow_start')}</label>
                <input type="number" class="adv-input f-part-glow-start" value="${d.particles_glow_start??''}" placeholder="0.0" step="0.1" min="0" max="1.0" onblur="clampAdv(this,0,1.0)"/>
                <div class="color-hint">Min: 0.0 · Max: 1.0 · Default: 0.0</div>
              </div>
              <div class="form-group">
                <label>${t('adv_glow_end')}</label>
                <input type="number" class="adv-input f-part-glow-end" value="${d.particles_glow_end??''}" placeholder="0.1" step="0.1" min="0" max="1.0" onblur="clampAdv(this,0,1.0)"/>
                <div class="color-hint">Min: 0.0 · Max: 1.0 · Default: 0.1</div>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>${t('adv_size_start')}</label>
                <input type="number" class="adv-input f-part-size-start" value="${d.particles_size_start??''}" placeholder="0.3" step="0.1" min="0.1" max="2.0" onblur="clampAdv(this,0.1,2.0)"/>
                <div class="color-hint">Min: 0.1 · Max: 2.0 · Default: 0.3</div>
              </div>
              <div class="form-group">
                <label>${t('adv_size_end')}</label>
                <input type="number" class="adv-input f-part-size-end" value="${d.particles_size_end??''}" placeholder="1.0" step="0.1" min="0.1" max="2.0" onblur="clampAdv(this,0.1,2.0)"/>
                <div class="color-hint">Min: 0.1 · Max: 2.0 · Default: 1.0</div>
              </div>
            </div>
          </div>
        </div>
        <details class="tip-box" style="margin-top:12px;">
          <summary><i class="fa-solid fa-circle-info tip-icon"></i>${t('title_special_intro')}</summary>
          <ul>
            <li>${t('title_tip_rgb')}</li>
            <li>${t('title_tip_rainbow')}</li>
            <li>${t('title_tip_random')}</li>
          </ul>
        </details>
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
            <textarea class="f-title-txt" placeholder="♥ My title! ♥ (empty = auto)">${esc((d.title_text||'').replace(/\\n/g, '\n'))}</textarea>
          </div>
        </div>
        <div style="margin-top:14px;">
          <div class="toggle-row" style="padding:4px 0 10px;border-bottom:none;">
            <div><div class="toggle-label">${t('title_color_override')}</div></div>
            <label class="toggle"><input type="checkbox" class="f-title-col-en" ${d.title_color_enabled ? 'checked' : ''} onchange="toggleColorEnable(this,'titleColFields')"><span class="toggle-track"></span></label>
          </div>
          <div id="titleColFields" style="${d.title_color_enabled ? '' : 'opacity:0.35;pointer-events:none;'}">
            <div class="form-grid">
              <div class="form-group">
                <label>${t('title_color')}</label>
                ${colorFieldHTML('f-title-col', d.title_color||'<1.0, 1.0, 1.0>', 'particles_color_hint')}
              </div>
            </div>
          </div>
        </div>
        <details class="tip-box" style="margin-top:12px;">
          <summary><i class="fa-solid fa-circle-info tip-icon"></i>${t('title_tokens_summary')}</summary>
          <ul>
            <li><code>{avatar}</code> — ${t('token_avatar')}</li>
            <li><code>{outfit}</code> — ${t('token_outfit')}</li>
            <li><code>{range}</code> — ${t('token_range')}</li>
            <li><code>{me}</code> — ${t('token_me')} (<i class="fa-solid fa-egg" style="font-size:10px;opacity:0.7;"></i>)</li>
            <li><code>{access}</code> — ${t('token_access')} ${wip}</li>
            <li><code>{toucher}</code> — ${t('token_toucher')} ${wip}</li>
          </ul>
        </details>
      </div>
    </div>

    <!-- BIOGRAPHY -->
    <div class="section" id="sec_biography">
      <div class="section-header" onclick="toggleSection('sec_biography')">
        <i class="fa-solid fa-id-card section-icon"></i>
        <span class="section-label">${t('sec_biography')}</span>
        <i class="fa-solid fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-body">
        <div class="form-group">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
            <label style="margin-bottom:0;">${t('biography_text')}</label>
            <button type="button" class="emoji-open-btn" onclick="openEmojiPicker(event)" title="Insert emoji">
              <i class="fa-regular fa-face-smile"></i>
            </button>
          </div>
          <textarea class="f-bio" placeholder="${t('biography_ph')}" maxlength="1023" style="min-height:100px;" oninput="updateBioCounter(this)">${esc((d.biography||'').replace(/\\n/g, '\n'))}</textarea>
          <div class="bio-counter-row">
            <div class="toggle-desc" style="margin:0;">${t('biography_desc')}</div>
            <span class="bio-counter" id="bioCounter">${(d.biography||'').replace(/\\n/g,'\n').length} / 1023</span>
          </div>
        </div>
      </div>
    </div>

  </div>`;

  initTagWidget(id);
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

function gateColorEnd(startCb) {
  const endToggle = document.getElementById('partColEndToggle');
  const endCb     = document.querySelector('.f-part-col-end-en');
  if (!endToggle || !endCb) return;
  endToggle.style.opacity       = startCb.checked ? '' : '0.4';
  endToggle.style.pointerEvents = startCb.checked ? '' : 'none';
  endCb.disabled = !startCb.checked;
  if (!startCb.checked && endCb.checked) {
    endCb.checked = false;
    toggleColorEnable(endCb, 'partColEndFields');
  }
}

function clampAdv(el, min, max) {
  const v = parseFloat(el.value);
  if (isNaN(v) || el.value.trim() === '') return;
  if (v < min) el.value = min;
  else if (v > max) el.value = max;
}

function toggleColorEnable(cb, wrapperId) {
  const w = document.getElementById(wrapperId);
  if (!w) return;
  w.style.opacity = cb.checked ? '1' : '0.35';
  w.style.pointerEvents = cb.checked ? '' : 'none';
}

function initTagWidget(outfitId) {
  const wrap   = document.getElementById(`tagWrap_${outfitId}`);
  const hidden = document.getElementById(`tagHidden_${outfitId}`);
  const input  = document.getElementById(`tagInput_${outfitId}`);
  const acEl   = document.getElementById(`tagAc_${outfitId}`);
  const addBtn = document.getElementById(`tagAddBtn_${outfitId}`);
  if (!wrap || !hidden || !input || !acEl) return;

  const TAG_PALETTE = ['#e8197a','#e86019','#e8c819','#6de819','#19d4e8','#1965e8','#8c19e8','#e819c8','#19e888','#e84040','#8899cc',''];

  let acHighlighted = -1;
  let chipDragSrc   = null;

  function getOutfit() { return outfits.find(x => x.id === outfitId); }

  function getTags() {
    const v = hidden.value.trim();
    return v ? v.split(/\s+/) : [];
  }

  function commit(tags) {
    hidden.value = tags.join(' ');
    renderChips();
    saveActiveEditor();
  }

  function renderChips() {
    wrap.querySelectorAll('.tag-chip').forEach(c => c.remove());
    const tags = getTags();
    const frag = document.createDocumentFragment();

    // Auto chip for gender — read from DOM for real-time updates
    const gSel = document.querySelector('.f-gender');
    const o = getOutfit();
    const g = (gSel ? gSel.value : null) || (o && o.data.gender);
    if (g && g !== 'Auto') {
      const gChip = document.createElement('span');
      gChip.className = 'tag-chip tag-chip-auto';
      gChip.title = 'Auto-tag from gender setting';
      gChip.innerHTML = `<span class="tag-chip-label">${esc(g.toLowerCase())}</span>`;
      frag.appendChild(gChip);
    }

    tags.forEach(tag => {
      const color = tagColors[tag] || '';
      const chip  = document.createElement('span');
      chip.className   = 'tag-chip';
      chip.dataset.tag = tag;
      if (color) chip.style.cssText = `border-color:${color};color:${color};background:${color}22;`;
      chip.innerHTML = `<span class="tag-chip-label">${esc(tag)}</span><button class="tag-chip-x" data-tag="${esc(tag)}" tabindex="-1" type="button">×</button>`;

      chip.draggable = true;
      chip.addEventListener('dragstart', e => {
        chipDragSrc = tag;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => chip.classList.add('chip-dragging'), 0);
      });
      chip.addEventListener('dragover',  e => { e.preventDefault(); chip.classList.add('chip-drag-over'); });
      chip.addEventListener('dragleave', ()  => chip.classList.remove('chip-drag-over'));
      chip.addEventListener('drop', e => {
        e.preventDefault(); e.stopPropagation();
        chip.classList.remove('chip-drag-over');
        if (!chipDragSrc || chipDragSrc === tag) return;
        const t2 = getTags();
        const si = t2.indexOf(chipDragSrc), ti = t2.indexOf(tag);
        if (si === -1 || ti === -1) return;
        t2.splice(si, 1); t2.splice(ti, 0, chipDragSrc);
        commit(t2);
      });
      chip.addEventListener('dragend', () => { chip.classList.remove('chip-dragging'); chipDragSrc = null; });
      chip.addEventListener('click', e => {
        if (e.target.closest('.tag-chip-x')) return;
        openColorPicker(tag, chip);
      });
      frag.appendChild(chip);
    });
    wrap.insertBefore(frag, input);
    input.placeholder = tags.length ? '' : t('tags_ph');
  }

  function openColorPicker(tag, chipEl) {
    let picker = document.getElementById('_tagColorPicker');
    if (!picker) {
      picker = document.createElement('div');
      picker.id = '_tagColorPicker';
      picker.className = 'tag-color-picker';
      document.body.appendChild(picker);
    }
    const curColor = tagColors[tag] || '';
    picker.innerHTML = TAG_PALETTE.map(c =>
      `<button class="tcp-swatch${c === curColor ? ' tcp-active' : ''}${c ? '' : ' tcp-reset'}" data-color="${esc(c)}" style="${c ? 'background:' + c : ''}" title="${c || 'Remove color'}"></button>`
    ).join('');
    const rect = chipEl.getBoundingClientRect();
    picker.style.top  = (rect.bottom + 4) + 'px';
    picker.style.left = Math.min(rect.left, window.innerWidth - 184) + 'px';
    picker.style.display = 'flex';
    picker.onmousedown = e => {
      e.preventDefault();
      const btn = e.target.closest('.tcp-swatch');
      if (!btn) return;
      const col = btn.dataset.color;
      if (col) tagColors[tag] = col; else delete tagColors[tag];
      saveTagColors();
      picker.style.display = 'none';
      renderChips();
      renderSidebar();
    };
    function closeOnClick(ev) {
      if (!picker.contains(ev.target)) {
        picker.style.display = 'none';
        document.removeEventListener('mousedown', closeOnClick);
      }
    }
    setTimeout(() => document.addEventListener('mousedown', closeOnClick), 0);
  }

  function openAllTagsMenu(btnEl) {
    let menu = document.getElementById('_tagAllMenu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = '_tagAllMenu';
      menu.className = 'tag-all-menu';
      document.body.appendChild(menu);
    }
    const current = new Set(getTags());
    const counts  = new Map();
    outfits.forEach(o => {
      (o.data.tags || '').trim().split(/\s+/).filter(Boolean).forEach(tag => {
        if (!current.has(tag)) counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    menu.innerHTML = sorted.length
      ? sorted.map(([tag]) => {
          const col = tagColors[tag] || '';
          const s = col ? ` style="border-color:${col};color:${col}"` : '';
          return `<button class="tag-all-item"${s} data-tag="${esc(tag)}">${esc(tag)}</button>`;
        }).join('')
      : `<span class="tag-all-empty">No hay tags todavía</span>`;
    const scrollEl = document.getElementById('mainPanel');
    if (menu.parentElement !== scrollEl) scrollEl.appendChild(menu);

    const panelRect = scrollEl.getBoundingClientRect();
    const btnRect   = btnEl.getBoundingClientRect();
    menu.style.top  = (btnRect.bottom - panelRect.top + scrollEl.scrollTop + 4) + 'px';
    menu.style.left = Math.min(btnRect.right - panelRect.left - 4, panelRect.width - 224) + 'px';
    menu.style.display = 'flex';

    menu.onmousedown = e => {
      e.preventDefault();
      const btn = e.target.closest('.tag-all-item');
      if (!btn) return;
      addTag(btn.dataset.tag);
      btn.remove();
      if (!menu.children.length) menu.style.display = 'none';
    };
    function closeMenu(ev) {
      if (!menu.contains(ev.target) && ev.target !== btnEl) {
        menu.style.display = 'none';
        document.removeEventListener('mousedown', closeMenu);
      }
    }
    setTimeout(() => document.addEventListener('mousedown', closeMenu), 0);
  }

  function normalize(raw) {
    return raw.toLowerCase().trim().replace(/[^a-z0-9\-]/g, '').slice(0, 24);
  }

  function addTag(raw) {
    const tag = normalize(raw);
    if (!tag) return;
    const tags = getTags();
    if (tags.includes(tag)) return;
    commit([...tags, tag]);
  }

  function removeTag(tag) {
    commit(getTags().filter(x => x !== tag));
  }

  function collectSuggestions(query) {
    const q = query.toLowerCase();
    const current = new Set(getTags());
    const all = new Set();
    outfits.forEach(o => {
      (o.data.tags || '').trim().split(/\s+/).filter(Boolean).forEach(tag => {
        if (!current.has(tag) && tag.startsWith(q)) all.add(tag);
      });
    });
    return [...all].sort().slice(0, 8);
  }

  function openAc(query) {
    if (!query) { closeAc(); return; }
    const suggestions = collectSuggestions(query);
    if (!suggestions.length) { closeAc(); return; }
    acHighlighted = -1;
    acEl.innerHTML = suggestions.map(tag =>
      `<div class="tag-ac-item" data-tag="${esc(tag)}">${esc(tag)}</div>`
    ).join('');
    const r = input.getBoundingClientRect();
    acEl.style.top   = (r.bottom + 2) + 'px';
    acEl.style.left  = r.left + 'px';
    acEl.style.width = r.width + 'px';
    acEl.style.display = '';
  }

  function closeAc() {
    acEl.style.display = 'none';
    acEl.innerHTML = '';
    acHighlighted = -1;
  }

  function acSetHighlight(idx) {
    const items = acEl.querySelectorAll('.tag-ac-item');
    acHighlighted = Math.max(-1, Math.min(idx, items.length - 1));
    items.forEach((el, i) => el.classList.toggle('active', i === acHighlighted));
  }

  function acPickCurrent() {
    if (acHighlighted < 0) return null;
    const items = acEl.querySelectorAll('.tag-ac-item');
    return items[acHighlighted] ? items[acHighlighted].dataset.tag : null;
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); acSetHighlight(acHighlighted + 1); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); acSetHighlight(acHighlighted - 1); return; }
    if (e.key === 'Escape') { closeAc(); return; }
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      const picked = acPickCurrent();
      if (picked) { e.preventDefault(); addTag(picked); input.value = ''; closeAc(); return; }
      if (input.value.trim()) { e.preventDefault(); addTag(input.value); input.value = ''; closeAc(); return; }
    }
    if (e.key === 'Tab') {
      const picked = acPickCurrent();
      if (picked) { e.preventDefault(); addTag(picked); input.value = ''; closeAc(); return; }
      const q = input.value.trim();
      if (q) {
        e.preventDefault();
        const suggs = collectSuggestions(q);
        addTag(suggs.length === 1 ? suggs[0] : q);
        input.value = ''; closeAc();
      }
      return;
    }
    if (e.key === 'Backspace' && input.value === '') {
      const tags = getTags();
      if (tags.length) removeTag(tags[tags.length - 1]);
    }
  });

  input.addEventListener('input', () => openAc(input.value.trim()));

  input.addEventListener('blur', () => {
    setTimeout(() => {
      const picked = acPickCurrent();
      const raw = input.value.trim();
      if (picked) { addTag(picked); }
      else if (raw) { addTag(raw); }
      input.value = '';
      closeAc();
    }, 150);
  });

  acEl.addEventListener('mousedown', e => {
    e.preventDefault();
    const item = e.target.closest('.tag-ac-item');
    if (item) { addTag(item.dataset.tag); input.value = ''; closeAc(); input.focus(); }
  });

  wrap.addEventListener('click', e => {
    const btn = e.target.closest('.tag-chip-x');
    if (btn) { removeTag(btn.dataset.tag); input.focus(); return; }
    if (!e.target.closest('.tag-chip')) input.focus();
  });

  if (addBtn) addBtn.addEventListener('click', e => { e.stopPropagation(); openAllTagsMenu(addBtn); });

  // Re-render chips when gender changes
  const genderSel = document.querySelector('.f-gender');
  if (genderSel) genderSel.addEventListener('change', renderChips);

  renderChips();
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

  d.particles_enabled       = getTs('f-part-en');
  d.particles_texture       = get('.f-part-tex').value;
  const _dur = get('.f-part-dur').value.trim();
  d.particles_duration      = _dur === '' ? null : parseFloat(_dur);
  d.particles_color_start_enabled = get('.f-part-col-start-en') ? get('.f-part-col-start-en').checked : false;
  d.particles_color_end_enabled   = get('.f-part-col-end-en')   ? get('.f-part-col-end-en').checked   : false;
  d.particles_color_start   = get('.f-part-col-start').value;
  d.particles_color_end     = get('.f-part-col-end').value;
  const _nf = sel => { const el = get(sel); return el && el.value.trim() !== '' ? parseFloat(el.value) : null; };
  d.particles_radius       = _nf('.f-part-radius');
  d.particles_alpha_start  = _nf('.f-part-alpha-start');
  d.particles_alpha_end    = _nf('.f-part-alpha-end');
  d.particles_glow_start   = _nf('.f-part-glow-start');
  d.particles_glow_end     = _nf('.f-part-glow-end');
  d.particles_size_start   = _nf('.f-part-size-start');
  d.particles_size_end     = _nf('.f-part-size-end');
  d.title_enabled           = getTs('f-title-en');
  d.title_text              = get('.f-title-txt').value.replace(/\n/g, '\\n');
  d.title_color_enabled     = get('.f-title-col-en') ? get('.f-title-col-en').checked : false;
  d.title_color             = get('.f-title-col').value;
  if (get('.f-bio')  !== null) d.biography = get('.f-bio').value.replace(/\n/g, '\\n');
  if (get('.f-tags') !== null) d.tags = get('.f-tags').value.trim();
}

/* ── BIO COUNTER ── */
function updateBioCounter(ta) {
  const c = document.getElementById('bioCounter');
  if (!c) return;
  const len = ta.value.length;
  c.textContent = len + ' / 1023';
  c.classList.toggle('bio-counter-over', len >= 1000);
}

/* ── EMOJI PICKER (emoji-picker-element) ── */
let _emojiPickerReady = false;

function openEmojiPicker(e) {
  e.stopPropagation();
  const popup = document.getElementById('emojiPickerPopup');
  if (!popup) return;
  if (popup.classList.contains('open')) { closeEmojiPicker(); return; }

  if (!_emojiPickerReady) {
    const picker = popup.querySelector('emoji-picker');
    if (picker) {
      picker.addEventListener('emoji-click', ev => insertEmoji(ev.detail.unicode));
      _emojiPickerReady = true;
    }
  }

  const panel = document.getElementById('mainPanel');
  if (popup.parentElement !== panel) panel.appendChild(popup);
  const panelRect = panel.getBoundingClientRect();
  const rect = e.currentTarget.getBoundingClientRect();
  const top  = rect.bottom - panelRect.top + panel.scrollTop + 6;
  const left = Math.max(4, Math.min(rect.right - panelRect.left - 340, panel.clientWidth - 348));
  popup.style.top  = top + 'px';
  popup.style.left = left + 'px';
  popup.classList.add('open');
}

function closeEmojiPicker() {
  const popup = document.getElementById('emojiPickerPopup');
  if (popup) popup.classList.remove('open');
}

function insertEmoji(emoji) {
  const ta = document.querySelector('.f-bio');
  if (!ta) return;
  const s = ta.selectionStart, end = ta.selectionEnd;
  ta.value = ta.value.slice(0, s) + emoji + ta.value.slice(end);
  ta.selectionStart = ta.selectionEnd = s + emoji.length;
  ta.focus();
  updateBioCounter(ta);
  closeEmojiPicker();
}
