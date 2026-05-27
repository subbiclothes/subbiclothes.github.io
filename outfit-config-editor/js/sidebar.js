let dragSrcId = null;
let searchByTag = false;
let collapsedGroups = new Set();

function toggleGroup(avatar) {
  if (collapsedGroups.has(avatar)) collapsedGroups.delete(avatar);
  else collapsedGroups.add(avatar);
  renderSidebar();
}

function getFiltered() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  if (!q) return outfits;
  if (searchByTag) {
    const queryTags = q.split(/\s+/).filter(Boolean);
    return outfits.filter(o => {
      const outfitTags = (o.data.tags || '').toLowerCase().split(/\s+/).filter(Boolean);
      return queryTags.every(qt => outfitTags.some(ot => ot.includes(qt)));
    });
  }
  return outfits.filter(o => o.name.toLowerCase().includes(q) || o.avatar.toLowerCase().includes(q));
}

function toggleSearchMode() {
  searchByTag = !searchByTag;
  document.getElementById('searchTagToggle').classList.toggle('active', searchByTag);
  document.getElementById('searchInput').placeholder = searchByTag ? 'Search tags…' : 'Search name…';
  renderSidebar();
}

function toggleSidebarCollapse() {
  document.querySelector('.sidebar').classList.toggle('sidebar-collapsed');
}

function outfitItemHTML(o) {
  const g = o.data.gender || 'Neutral';
  const gc = g === 'Female' ? 'gb-female' : g === 'Male' ? 'gb-male' : 'gb-neutral';
  const tags = (o.data.tags || '').trim().split(/\s+/).filter(Boolean).slice(0, 3);
  const tagsHTML = tags.map(tag => {
    const col = tagColors[tag] || '';
    const s = col ? ` style="border-color:${col};color:${col}"` : '';
    return `<span class="outfit-tag-mini"${s}>${tag}</span>`;
  }).join('');
  return `<div class="outfit-item ${o.id === activeId ? 'active' : ''}"
    data-id="${o.id}"
    data-avatar="${o.avatar.replace(/"/g,'&quot;')}"
    draggable="true"
    onclick="selectOutfit('${o.id}')"
    ondragstart="dragStart(event,'${o.id}')"
    ondragover="dragOver(event)"
    ondragleave="dragLeave(event)"
    ondrop="dragDrop(event,'${o.id}')"
    ondragend="dragEnd(event)">
    <i class="fa-solid fa-grip-vertical outfit-drag-handle"></i>
    <div class="outfit-item-info">
      <div class="outfit-item-name">${o.name}</div>
      <div class="outfit-item-meta">${o.avatar} · <span class="gender-badge ${gc}">${g}</span>${searchByTag && tagsHTML ? `<span class="outfit-tags-row">${tagsHTML}</span>` : ''}</div>
    </div>
  </div>`;
}

function renderSidebar() {
  const list = document.getElementById('outfitList');
  list.classList.toggle('compact', compactSidebar);
  const filtered = getFiltered();

  if (!outfits.length) {
    list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-dim);font-size:12px;letter-spacing:1px;">${t('empty_hint')}</div>`;
    return;
  }
  if (!filtered.length) {
    list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-dim);font-size:12px;">No results</div>`;
    return;
  }

  if (groupByGroup) {
    const groups = {};
    filtered.forEach(o => { if (!groups[o.avatar]) groups[o.avatar] = []; groups[o.avatar].push(o); });
    list.innerHTML = Object.keys(groups).sort().map(avatar => {
      const collapsed = collapsedGroups.has(avatar);
      const chevron = collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
      const safeAv = avatar.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      return `<div class="group-header group-header-toggle" onclick="toggleGroup('${safeAv}')">` +
        `<i class="fa-solid ${chevron} group-chevron"></i>` +
        `<i class="fa-solid fa-users" style="margin-right:5px;opacity:.6;"></i>${avatar}` +
        `<span class="group-count">${groups[avatar].length}</span></div>` +
        (collapsed ? '' : groups[avatar].map(outfitItemHTML).join(''));
    }).join('');
  } else {
    list.innerHTML = filtered.map(outfitItemHTML).join('');
  }
}

function toggleCompact() {
  compactSidebar = !compactSidebar;
  document.getElementById('btnCompact').classList.toggle('btn-group-active', compactSidebar);
  renderSidebar();
}

function toggleGroupBy() {
  groupByGroup = !groupByGroup;
  document.getElementById('btnGroupBy').classList.toggle('btn-group-active', groupByGroup);
  renderSidebar();
}

let preSortOrder = null;

function sortOutfits() {
  saveActiveEditor();
  const btn = document.querySelector('[onclick="sortOutfits()"]');
  if (preSortOrder) {
    // Restore original order
    const map = Object.fromEntries(outfits.map(o => [o.id, o]));
    outfits = preSortOrder.map(id => map[id]).filter(Boolean);
    preSortOrder = null;
    btn && btn.classList.remove('btn-group-active');
  } else {
    // Save current order then sort
    preSortOrder = outfits.map(o => o.id);
    outfits.sort((a, b) =>
      (a.avatar + '/' + a.name).toLowerCase().localeCompare((b.avatar + '/' + b.name).toLowerCase())
    );
    btn && btn.classList.add('btn-group-active');
  }
  renderSidebar();
  saveToStorage();
}

/* ── DRAG TO REORDER ── */

function dragStart(e, id) {
  dragSrcId = id;
  e.dataTransfer.effectAllowed = 'move';
  // slight delay so the item doesn't instantly look dragged in the thumbnail
  setTimeout(() => {
    const el = document.querySelector(`.outfit-item[data-id="${id}"]`);
    if (el) el.classList.add('dragging');
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const item = e.currentTarget;
  if (item.dataset.id !== dragSrcId) item.classList.add('drag-over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function dragDrop(e, targetId) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('drag-over');
  if (!dragSrcId || dragSrcId === targetId) return;

  const srcIdx = outfits.findIndex(o => o.id === dragSrcId);
  const tgtIdx = outfits.findIndex(o => o.id === targetId);
  if (srcIdx === -1 || tgtIdx === -1) return;

  // In grouped mode: only allow reorder within the same group
  if (groupByGroup && outfits[srcIdx].avatar !== outfits[tgtIdx].avatar) return;

  saveActiveEditor();
  const [item] = outfits.splice(srcIdx, 1);
  outfits.splice(tgtIdx, 0, item);
  // Manual reorder invalidates the saved pre-sort snapshot
  preSortOrder = null;
  const btn = document.querySelector('[onclick="sortOutfits()"]');
  btn && btn.classList.remove('btn-group-active');
  renderSidebar();
  saveToStorage();
}

function dragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  // clean up any leftover drag-over highlights in case dragLeave misfired
  document.querySelectorAll('.outfit-item.drag-over').forEach(el => el.classList.remove('drag-over'));
  dragSrcId = null;
}
