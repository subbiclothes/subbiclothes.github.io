// Prevent scroll from changing number input values
document.addEventListener('wheel', () => {
  if (document.activeElement.type === 'number') document.activeElement.blur();
}, { passive: true });

// Auto-save on input (debounced)
document.getElementById('mainPanel').addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveActiveEditor(); saveToStorage(); }, 400);
});

// Test/sandbox environment banner (activated via ?test in the URL)
if (typeof OCE_TEST_MODE !== 'undefined' && OCE_TEST_MODE) {
  document.title = '[TEST] ' + document.title;
  const wordmark = document.querySelector('.logo-wordmark');
  if (wordmark) {
    const badge = document.createElement('span');
    badge.className = 'test-env-badge';
    badge.textContent = 'TEST';
    badge.title = 'Sandbox environment — data saved separately from your normal config';
    wordmark.appendChild(badge);
  }
}

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
initSidebarResize();

document.addEventListener('click', () => closeApplyMenu());

// Help tooltips (? icons) — hover for mouse, click/focus for touch & keyboard
document.addEventListener('mouseover', e => {
  const icon = e.target.closest('.help-icon');
  if (icon) showHelpTip(icon);
});
document.addEventListener('mouseout', e => {
  if (e.target.closest('.help-icon')) hideHelpTip();
});
document.addEventListener('focusin', e => {
  const icon = e.target.closest('.help-icon');
  if (icon) showHelpTip(icon);
});
document.addEventListener('focusout', e => {
  if (e.target.closest('.help-icon')) hideHelpTip();
});
document.addEventListener('click', e => {
  const icon = e.target.closest('.help-icon');
  if (icon) { e.stopPropagation(); showHelpTip(icon); return; }
  hideHelpTip();
});
