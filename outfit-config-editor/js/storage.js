const STORAGE_KEY  = 'subbi_outfits_v1';
const COLORS_KEY   = 'subbi_tagcolors_v1';

function saveToStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits)); } catch(e) {}
}

function saveTagColors() {
  try { localStorage.setItem(COLORS_KEY, JSON.stringify(tagColors)); } catch(e) {}
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { outfits = JSON.parse(raw); return true; }
  } catch(e) {}
  return false;
}

function loadTagColors() {
  try {
    const raw = localStorage.getItem(COLORS_KEY);
    if (raw) tagColors = JSON.parse(raw);
  } catch(e) {}
  // One-time migration: pull per-outfit tagColors into global map
  outfits.forEach(o => {
    if (o.data && o.data.tagColors) {
      Object.assign(tagColors, o.data.tagColors);
      delete o.data.tagColors;
    }
  });
}
