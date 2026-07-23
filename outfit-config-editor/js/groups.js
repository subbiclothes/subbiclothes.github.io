function openAddGroupModal() {
  document.getElementById('g_add_name').value = '';
  openModal('addGroupModal');
  setTimeout(() => document.getElementById('g_add_name').focus(), 100);
}

function confirmAddGroup() {
  const name = document.getElementById('g_add_name').value.trim();
  if (!name) return;
  if (groups.some(g => g.name === name)) {
    notify(t('group_name_taken'));
    return;
  }
  const g = { id: 'g_' + Date.now(), name, data: DEFAULT_OUTFIT(), groupTags: '' };
  groups.push(g);
  closeModal('addGroupModal');
  renderSidebar();
  selectGroup(g.id);
  notify(t('group_added'));
  saveToStorage();
}

function openRenameGroupModal(id) {
  const g = groups.find(x => x.id === id);
  if (!g) return;
  renameGroupTargetId = id;
  document.getElementById('g_rename_name').value = g.name;
  openModal('renameGroupModal');
  setTimeout(() => document.getElementById('g_rename_name').focus(), 100);
}

function confirmRenameGroup() {
  const name = document.getElementById('g_rename_name').value.trim();
  if (!name || !renameGroupTargetId) return;
  const g = groups.find(x => x.id === renameGroupTargetId);
  if (!g) return;
  if (groups.some(x => x.id !== g.id && x.name === name)) {
    notify(t('group_name_taken'));
    return;
  }
  g.name = name;
  closeModal('renameGroupModal');
  renameGroupTargetId = null;
  renderSidebar();
  if (activeMode === 'group' && activeId === g.id) renderGroupEditor(g.id);
  notify(t('group_renamed'));
  saveToStorage();
}

function resetGroupDeleteClickState() {
  groupDeleteClickGroupId = null;
  groupDeleteClickCount = 0;
}

function confirmDeleteGroup(id) {
  const g = groups.find(x => x.id === id);
  if (!g) return;
  if (outfits.some(o => o.groupId === id)) {
    if (groupDeleteClickGroupId !== id) {
      groupDeleteClickGroupId = id;
      groupDeleteClickCount = 0;
    }
    groupDeleteClickCount++;
    if (groupDeleteClickCount <= 3) {
      notify(`${t('group_delete_blocked')} (${4 - groupDeleteClickCount})`, null, 3500);
      return;
    }
    if (groupDeleteClickCount === 4) {
      notify(t('group_delete_warning'), 'warning', 4500);
      return;
    }
    resetGroupDeleteClickState();
    outfits = outfits.filter(o => o.groupId !== id);
    deleteGroup(id);
    return;
  }
  resetGroupDeleteClickState();
  pendingDeleteGroupId = id;
  openModal('confirmDeleteGroupModal');
}

function confirmDeleteGroupNow() {
  if (!pendingDeleteGroupId) return;
  deleteGroup(pendingDeleteGroupId);
  closeModal('confirmDeleteGroupModal');
  pendingDeleteGroupId = null;
}

function deleteGroup(id) {
  groups = groups.filter(g => g.id !== id);
  if (activeMode === 'group' && activeId === id) {
    activeId = null;
    document.getElementById('editorContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = '';
  }
  renderSidebar();
  notify(t('group_deleted'));
  saveToStorage();
}

function selectGroup(id) {
  if (groupDeleteClickGroupId && groupDeleteClickGroupId !== id) resetGroupDeleteClickState();
  saveActiveEditor();
  activeMode = 'group';
  activeId = id;
  renderSidebar();
  renderGroupEditor(id);
}
