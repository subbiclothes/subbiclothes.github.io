// Prevent scroll from changing number input values
document.addEventListener('wheel', () => {
  if (document.activeElement.type === 'number') document.activeElement.blur();
}, { passive: true });

// Auto-save on input (debounced)
document.getElementById('mainPanel').addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveActiveEditor(); saveToStorage(); }, 400);
});

// Bootstrap: restore from localStorage, or start empty
const restored = loadFromStorage();
loadTagColors();
if (restored && outfits.length) {
  renderSidebar();
  selectOutfit(outfits[0].id);
} else {
  renderSidebar();
}
applyTranslations();

document.addEventListener('click', () => closeApplyMenu());
