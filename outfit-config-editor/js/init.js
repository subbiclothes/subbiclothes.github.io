// Prevent scroll from changing number input values
document.addEventListener('wheel', () => {
  if (document.activeElement.type === 'number') document.activeElement.blur();
}, { passive: true });

// Auto-save on input (debounced)
document.getElementById('mainPanel').addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveActiveEditor(); saveToStorage(); }, 400);
});

// Bootstrap: try localStorage first, otherwise load the example config
const restored = loadFromStorage();
if (!restored) {
  fetch('data/example.config')
    .then(r => r.text())
    .then(text => {
      parseConfig(text);
      if (outfits.length) selectOutfit(outfits[0].id);
    })
    .catch(() => {});
} else {
  renderSidebar();
  if (outfits.length) selectOutfit(outfits[0].id);
}
applyTranslations();
