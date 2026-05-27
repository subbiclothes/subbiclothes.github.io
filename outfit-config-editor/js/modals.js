function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function openUpload()   { openModal('uploadModal'); }

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

document.addEventListener('click', e => {
  if (!e.target.closest('#emojiPickerPopup') && !e.target.closest('.emoji-open-btn'))
    if (typeof closeEmojiPicker === 'function') closeEmojiPicker();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  if (e.key === 'Enter') {
    if (document.getElementById('addModal').classList.contains('open'))    confirmAdd();
    if (document.getElementById('renameModal').classList.contains('open')) confirmRename();
  }
});
