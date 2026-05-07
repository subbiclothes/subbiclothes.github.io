const STORAGE_KEY = 'subbi_outfits_v1';

function saveToStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits)); } catch(e) {}
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { outfits = JSON.parse(raw); return true; }
  } catch(e) {}
  return false;
}
