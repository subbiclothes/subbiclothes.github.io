let addManyMode = false;

function toggleAddMany() {
  addManyMode = !addManyMode;
  document.getElementById('addManyToggle').classList.toggle('active', addManyMode);
  const input = document.getElementById('m_outfit');
  input.placeholder = addManyMode ? 'Outfit1, Outfit2, Outfit3' : '<Outfit name>';
  document.getElementById('m_many_hint').style.display = addManyMode ? '' : 'none';
}

/* ── GROUP SELECT (shared by Add/Rename Outfit modals) ──
   A dropdown of existing groups plus a trailing "+ New group…" option that
   reveals an inline text field, so an outfit can be assigned to a brand
   new group without leaving the modal. */
function populateGroupSelect(sel, selectedId) {
  const sorted = [...groups].sort((a, b) => a.name.localeCompare(b.name));
  sel.innerHTML = sorted.map(g =>
    `<option value="${esc(g.id)}" ${g.id === selectedId ? 'selected' : ''}>${esc(g.name)}</option>`
  ).join('') + `<option value="__new__">${t('new_group_option')}</option>`;
  if (!selectedId) sel.value = sorted.length ? sorted[0].id : '__new__';
}

function onGroupSelectChange(sel, newInputId) {
  const newInput = document.getElementById(newInputId);
  const isNew = sel.value === '__new__';
  newInput.style.display = isNew ? '' : 'none';
  if (isNew) {
    newInput.value = '';
    setTimeout(() => newInput.focus(), 50);
  }
}

function resolveGroupSelection(selectId, newInputId) {
  const sel = document.getElementById(selectId);
  if (sel.value === '__new__') {
    const name = document.getElementById(newInputId).value.trim();
    if (!name) return null;
    return findOrCreateGroupByName(name).id;
  }
  return sel.value || null;
}

function openAddModal() {
  addManyMode = false;
  const sel = document.getElementById('m_avatar_select');
  populateGroupSelect(sel, null);
  onGroupSelectChange(sel, 'm_avatar_new');
  document.getElementById('m_outfit').value = '';
  document.getElementById('m_outfit').placeholder = '<Outfit name>';
  document.getElementById('m_many_hint').style.display = 'none';
  document.getElementById('addManyToggle').classList.remove('active');
  openModal('addModal');
  setTimeout(() => document.getElementById('m_outfit').focus(), 100);
}

function confirmAdd() {
  const groupId = resolveGroupSelection('m_avatar_select', 'm_avatar_new');
  const raw     = document.getElementById('m_outfit').value;
  if (!groupId || !raw.trim()) return;

  if (addManyMode) {
    const names = raw.split(',').map(s => s.trim()).filter(Boolean);
    if (!names.length) return;
    let lastId;
    names.forEach(name => {
      lastId = 'o_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
      outfits.push({ id: lastId, groupId, name, data: DEFAULT_OUTFIT() });
    });
    closeModal('addModal');
    renderSidebar();
    selectOutfit(lastId);
    notify(names.length + ' ' + t('outfit_added'));
    saveToStorage();
  } else {
    const name = raw.trim();
    if (!name) return;
    const id = 'o_' + Date.now();
    outfits.push({ id, groupId, name, data: DEFAULT_OUTFIT() });
    closeModal('addModal');
    renderSidebar();
    selectOutfit(id);
    notify(t('outfit_added'));
    saveToStorage();
  }
}

function openRenameModal(id) {
  const o = outfits.find(x => x.id === id);
  if (!o) return;
  renameTargetId = id;
  const sel = document.getElementById('r_avatar_select');
  populateGroupSelect(sel, o.groupId);
  onGroupSelectChange(sel, 'r_avatar_new');
  document.getElementById('r_outfit').value = o.name;
  openModal('renameModal');
  setTimeout(() => document.getElementById('r_outfit').focus(), 100);
}

function confirmRename() {
  const groupId = resolveGroupSelection('r_avatar_select', 'r_avatar_new');
  const name    = document.getElementById('r_outfit').value.trim();
  if (!groupId || !name || !renameTargetId) return;
  const o = outfits.find(x => x.id === renameTargetId);
  if (!o) return;
  o.groupId = groupId;
  o.name = name;
  closeModal('renameModal');
  renameTargetId = null;
  renderSidebar();
  if (activeMode === 'outfit' && activeId === o.id) renderEditor(o.id);
  notify(t('outfit_renamed'));
  saveToStorage();
}

function confirmDeleteOutfit(id) {
  pendingDeleteId = id;
  openModal('confirmDeleteModal');
}

function confirmDeleteNow() {
  if (!pendingDeleteId) return;
  deleteOutfit(pendingDeleteId);
  closeModal('confirmDeleteModal');
  pendingDeleteId = null;
}

function deleteOutfit(id) {
  outfits = outfits.filter(o => o.id !== id);
  if (activeMode === 'outfit' && activeId === id) {
    activeId = null;
    document.getElementById('editorContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = '';
  }
  renderSidebar();
  notify(t('outfit_deleted'));
  saveToStorage();
}

function selectOutfit(id) {
  resetGroupDeleteClickState();
  saveActiveEditor();
  activeMode = 'outfit';
  activeId = id;
  renderSidebar();
  renderEditor(id);
}

function duplicateOutfit(id) {
  saveActiveEditor();
  const o = outfits.find(x => x.id === id);
  if (!o) return;
  const newId = 'o_' + Date.now();
  outfits.push({ id: newId, groupId: o.groupId, name: o.name + ' (copy)', data: JSON.parse(JSON.stringify(o.data)) });
  renderSidebar();
  selectOutfit(newId);
  saveToStorage();
}
