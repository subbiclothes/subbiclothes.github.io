const STORAGE_KEY  = 'subbi_outfits_v1';
const GROUPS_KEY   = 'subbi_groups_v1';
const COLORS_KEY   = 'subbi_tagcolors_v1';

function saveToStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits)); } catch(e) {}
  try { localStorage.setItem(GROUPS_KEY, JSON.stringify(groups)); } catch(e) {}
}

function saveTagColors() {
  try { localStorage.setItem(COLORS_KEY, JSON.stringify(tagColors)); } catch(e) {}
}

function loadFromStorage() {
  let restored = false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { outfits = JSON.parse(raw); restored = true; }
  } catch(e) {}
  try {
    const rawGroups = localStorage.getItem(GROUPS_KEY);
    if (rawGroups) groups = JSON.parse(rawGroups);
  } catch(e) {}
  migrateGroups();
  return restored;
}

// One-time migration: legacy outfits carried a free-text "avatar" string instead
// of a groupId reference. Dedupe those names into real Group entities (first-seen
// order) and link each outfit by id, so renaming a group is instant everywhere.
function migrateGroups() {
  let changed = false;
  outfits.forEach(o => {
    if (o.groupId) return;
    if (o.avatar) {
      const g = findOrCreateGroupByName(o.avatar);
      o.groupId = g.id;
      delete o.avatar;
      changed = true;
    }
  });
  if (changed) saveToStorage();
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
