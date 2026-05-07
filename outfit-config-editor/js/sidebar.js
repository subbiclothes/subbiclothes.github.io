function getFiltered() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  if (!q) return outfits;
  return outfits.filter(o => o.name.toLowerCase().includes(q) || o.avatar.toLowerCase().includes(q));
}

function outfitItemHTML(o) {
  const g = o.data.gender || 'Neutral';
  const gc = g === 'Female' ? 'gb-female' : g === 'Male' ? 'gb-male' : 'gb-neutral';
  return `<div class="outfit-item ${o.id === activeId ? 'active' : ''}" data-id="${o.id}" onclick="selectOutfit('${o.id}')">
    <div class="outfit-item-info">
      <div class="outfit-item-name">${o.name}</div>
      <div class="outfit-item-avatar">${o.avatar} · <span class="gender-badge ${gc}">${g}</span></div>
    </div>
  </div>`;
}

function renderSidebar() {
  const list = document.getElementById('outfitList');
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
    list.innerHTML = Object.keys(groups).sort().map(avatar =>
      `<div class="group-header"><i class="fa-solid fa-users" style="margin-right:5px;opacity:.6;"></i>${avatar}</div>` +
      groups[avatar].map(outfitItemHTML).join('')
    ).join('');
  } else {
    list.innerHTML = filtered.map(outfitItemHTML).join('');
  }
}

function toggleGroupBy() {
  groupByGroup = !groupByGroup;
  document.getElementById('btnGroupBy').classList.toggle('btn-group-active', groupByGroup);
  renderSidebar();
}

function sortOutfits() {
  saveActiveEditor();
  outfits.sort((a, b) =>
    (a.avatar + '/' + a.name).toLowerCase().localeCompare((b.avatar + '/' + b.name).toLowerCase())
  );
  renderSidebar();
  saveToStorage();
}
