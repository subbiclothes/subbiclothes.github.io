function openAddModal() {
  document.getElementById('m_avatar').value = '';
  document.getElementById('m_outfit').value = '';
  openModal('addModal');
  setTimeout(() => document.getElementById('m_avatar').focus(), 100);
}

function confirmAdd() {
  const avatar = document.getElementById('m_avatar').value.trim();
  const name   = document.getElementById('m_outfit').value.trim();
  if (!avatar || !name) return;
  const id = 'o_' + Date.now();
  outfits.push({ id, avatar, name, data: DEFAULT_OUTFIT() });
  closeModal('addModal');
  renderSidebar();
  selectOutfit(id);
  notify(t('outfit_added'));
  saveToStorage();
}

function openRenameModal(id) {
  const o = outfits.find(x => x.id === id);
  if (!o) return;
  renameTargetId = id;
  document.getElementById('r_avatar').value = o.avatar;
  document.getElementById('r_outfit').value = o.name;
  openModal('renameModal');
  setTimeout(() => document.getElementById('r_outfit').focus(), 100);
}

function confirmRename() {
  const avatar = document.getElementById('r_avatar').value.trim();
  const name   = document.getElementById('r_outfit').value.trim();
  if (!avatar || !name || !renameTargetId) return;
  const o = outfits.find(x => x.id === renameTargetId);
  if (!o) return;
  o.avatar = avatar;
  o.name = name;
  closeModal('renameModal');
  renameTargetId = null;
  renderSidebar();
  if (activeId === o.id) renderEditor(o.id);
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
  if (activeId === id) {
    activeId = null;
    document.getElementById('editorContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = '';
  }
  renderSidebar();
  notify(t('outfit_deleted'));
  saveToStorage();
}

function selectOutfit(id) {
  saveActiveEditor();
  activeId = id;
  renderSidebar();
  renderEditor(id);
}

function duplicateOutfit(id) {
  saveActiveEditor();
  const o = outfits.find(x => x.id === id);
  if (!o) return;
  const newId = 'o_' + Date.now();
  outfits.push({ id: newId, avatar: o.avatar, name: o.name + ' (copy)', data: JSON.parse(JSON.stringify(o.data)) });
  renderSidebar();
  selectOutfit(newId);
  saveToStorage();
}
