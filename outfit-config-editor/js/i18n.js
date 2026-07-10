function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }

function setLang(l) {
  lang = l;
  document.getElementById('btn-en').classList.toggle('active', l === 'en');
  document.getElementById('btn-es').classList.toggle('active', l === 'es');
  applyTranslations();
  if (activeId) {
    saveActiveEditor();
    if (activeMode === 'group') renderGroupEditor(activeId);
    else renderEditor(activeId);
  }
  renderSidebar();
}

function applyTranslations() {
  document.querySelectorAll('[data-t]').forEach(el => {
    el.textContent = t(el.getAttribute('data-t'));
  });
  document.querySelectorAll('[data-t-ph]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-t-ph'));
  });
  document.querySelectorAll('[data-t-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-t-html'));
  });
  const instrList = document.getElementById('instrList');
  if (instrList) {
    instrList.innerHTML = (INSTR[lang] || INSTR.en).map(fn => `<li>${fn()}</li>`).join('');
  }
}
