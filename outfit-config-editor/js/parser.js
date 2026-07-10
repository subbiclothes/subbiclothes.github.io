function loadFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { parseConfig(e.target.result); closeModal('uploadModal'); };
  reader.readAsText(file);
  event.target.value = '';
}

function parsePasteArea() {
  const text = document.getElementById('pasteArea').value.trim();
  if (!text) return;
  parseConfig(text);
  document.getElementById('pasteArea').value = '';
  closeModal('uploadModal');
}

function parseConfig(text) {
  importing = true;
  const overwrite     = document.getElementById('chk-overwrite')?.checked ?? true;
  const removeMismatch = document.getElementById('chk-remove-mismatch')?.checked ?? false;

  const lines = text.split('\n');
  const blockRegex = /^\s*"([^"]+\/[^"]+)"\s*:\s*\{/;
  let currentKey = null, blockLines = [], inBlock = false, parsed = 0;
  const parsedKeys = new Set();

  lines.forEach(line => {
    if (!inBlock) {
      const m = line.match(blockRegex);
      if (m) { currentKey = m[1]; blockLines = ['{']; inBlock = true; }
    } else {
      if (line.includes('// === END OUTFIT ===')) {
        blockLines.push('}');
        if (tryParseBlock(currentKey, blockLines.join('\n'), overwrite)) {
          parsedKeys.add(currentKey);
          parsed++;
        }
        inBlock = false; currentKey = null; blockLines = [];
      } else {
        const stripped = line.replace(/\/\/.*$/, '').trimEnd();
        if (stripped.trim()) blockLines.push(stripped);
      }
    }
  });

  // Restore global tag colors if present in file
  const colorLine = lines.find(l => l.trimStart().startsWith('// SUBBI_OCE_COLORS:'));
  if (colorLine) {
    try {
      const parsedColors = JSON.parse(colorLine.slice(colorLine.indexOf(':') + 1).trim());
      Object.assign(tagColors, parsedColors);
      saveTagColors();
    } catch(e) {}
  }

  // Restore Group Tags (independent category, one self-contained JSON line per group)
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{"group-tags-')) return;
    try {
      const obj = JSON.parse(trimmed);
      const fullKey = Object.keys(obj)[0];
      const gname = fullKey.replace(/^group-tags-/, '');
      const g = findOrCreateGroupByName(gname);
      g.groupTags = obj[fullKey].split(',').map(s => s.trim()).filter(Boolean).join(' ');
    } catch(e) {}
  });

  if (removeMismatch) {
    outfits = outfits.filter(o => parsedKeys.has(groupName(o) + '/' + o.name));
    if (activeId && !outfits.find(o => o.id === activeId) && !groups.find(g => g.id === activeId)) activeId = null;
  }

  importing = false;
  if (activeId && activeMode === 'outfit' && outfits.find(o => o.id === activeId)) renderEditor(activeId);
  if (activeId && activeMode === 'group' && groups.find(g => g.id === activeId)) renderGroupEditor(activeId);
  renderSidebar();
  if (parsed > 0 && !activeId && outfits.length) selectOutfit(outfits[0].id);
  notify(`${parsed} outfit${parsed !== 1 ? 's' : ''} loaded`);
  saveToStorage();
}

// Best-effort repair for the hand-rolled (JSON-like, comment-tolerant) block
// format written by serializeSettingsBlock: fills in commas the original
// generator omits between consecutive fields.
function fixBlockJson(blockText) {
  const addMissingCommas = src => {
    const ls = src.split('\n');
    const out = [];
    for (let i = 0; i < ls.length; i++) {
      let s = ls[i].trimEnd();
      if (s && !s.endsWith(',') && !s.endsWith('{') && !s.endsWith('[')) {
        for (let j = i + 1; j < ls.length; j++) {
          const nx = ls[j].trim();
          if (nx && !nx.startsWith('}') && !nx.startsWith(']')) { s += ','; break; }
          else if (nx) break;
        }
      }
      out.push(s);
    }
    return out.join('\n');
  };
  return addMissingCommas(blockText).replace(/,\s*([}\]])/g, '$1');
}

// Fills a DEFAULT_OUTFIT()-shaped settings object `d` from a parsed block
// `obj` — shared by outfit blocks and group ("avatar/*") blocks, since both
// carry the same cascading field set.
function parseSettingsBlock(obj, d) {
  if (obj.gender)                          d.gender = obj.gender;
  if (obj.animations_enabled !== undefined) d.animations_enabled = obj.animations_enabled;
  if (obj.skelfix_change !== undefined)    d.skelfix_change = obj.skelfix_change;
  if (obj.skelfix_reload !== undefined)    d.skelfix_reload = obj.skelfix_reload;
  if (obj.nudity_permission !== undefined) d.nudity_permission = obj.nudity_permission;
  if (obj.hairstyle_permission !== undefined) d.hairstyle_permission = obj.hairstyle_permission;
  if (obj.clothes_permission !== undefined)   d.clothes_permission = obj.clothes_permission;
  if (obj.lock_ankles !== undefined)          d.lock_ankles = obj.lock_ankles;
  if (obj.pg_safe_mode !== undefined)         d.pg_safe_mode = obj.pg_safe_mode;

  BODY_PARTS.forEach(p => {
    const bpKey = Object.keys(obj).find(k => k.trim() === p);
    if (bpKey) d.bodyparts[p] = {
      enabled: true,
      normal:      obj[bpKey].normal || '',
      underwear:   obj[bpKey].underwear || '',
      wear_anim:   obj[bpKey].wear_anim || '',
      wear_time:   parseFloat(obj[bpKey].wear_time || ''),
      remove_anim: obj[bpKey].remove_anim || '',
      remove_time: parseFloat(obj[bpKey].remove_time || '')
    };
  });

  if (obj.particles_enabled !== undefined) d.particles_enabled = obj.particles_enabled;
  if (obj.particles_texture)               d.particles_texture = obj.particles_texture;
  if (obj.particles_duration !== undefined) d.particles_duration = obj.particles_duration;

  // Handle both legacy single color and new start:end gradient format
  if (obj.particles_color) {
    const gradMatch = obj.particles_color.match(/^(<[^>]+>):(<[^>]+>)$/);
    if (gradMatch) {
      d.particles_color_start         = decodeColorFromInput(gradMatch[1]);
      d.particles_color_end           = decodeColorFromInput(gradMatch[2]);
      d.particles_color_start_enabled = true;
      d.particles_color_end_enabled   = true;
    } else {
      d.particles_color_start         = decodeColorFromInput(obj.particles_color);
      d.particles_color_end           = decodeColorFromInput(obj.particles_color);
      d.particles_color_start_enabled = true;
    }
  }
  if (obj.particles_color_start) { d.particles_color_start = decodeColorFromInput(obj.particles_color_start); d.particles_color_start_enabled = true; }
  if (obj.particles_color_end)   { d.particles_color_end   = decodeColorFromInput(obj.particles_color_end);   d.particles_color_end_enabled   = true; }

  if (obj.title_enabled !== undefined) d.title_enabled = obj.title_enabled;
  if (obj.title_text !== undefined) {
    const decoded = decodeTitleText(obj.title_text);
    d.title_text = decoded.text;
    d.title_mode = decoded.mode;
    if (decoded.scrollSize) d.title_scroll_size = decoded.scrollSize;
  }
  if (obj.title_color)             { d.title_color   = decodeColorFromInput(obj.title_color); d.title_color_enabled = true; }
  if (obj.biography !== undefined)   d.biography     = obj.biography;
}

function tryParseBlock(key, blockText, overwrite = true) {
  const [avatar, ...rest] = key.split('/');
  const name = rest.join('/');
  try {
    const obj = JSON.parse(fixBlockJson(blockText));

    if (name === '*') {
      const g = findOrCreateGroupByName(avatar);
      parseSettingsBlock(obj, g.data);
      return true;
    }

    const groupId = findOrCreateGroupByName(avatar).id;
    const d = DEFAULT_OUTFIT();
    parseSettingsBlock(obj, d);
    if (obj.tags !== undefined) d.tags = obj.tags;

    const existing = outfits.find(o => o.groupId === groupId && o.name === name);
    if (existing) { if (overwrite) existing.data = d; }
    else outfits.push({ id: 'o_' + Date.now() + '_' + Math.random().toString(36).slice(2,6), groupId, name, data: d });
    return true;
  } catch(e) {
    console.warn('Could not parse block:', key, e);
    return false;
  }
}
