// Test/sandbox environment: activated with ?test (or ?env=test) in the URL.
// It swaps the localStorage keys for a separate "_test" namespace, so the
// sandbox starts as a clean template and never touches the normal config.
const OCE_TEST_MODE = (() => {
  try {
    const p = new URLSearchParams(location.search);
    return p.has('test') || p.get('env') === 'test';
  } catch (e) { return false; }
})();
const KEY_SUFFIX = OCE_TEST_MODE ? '_test' : '';

const STORAGE_KEY  = 'subbi_outfits_v1'   + KEY_SUFFIX;
const GROUPS_KEY   = 'subbi_groups_v1'    + KEY_SUFFIX;
const COLORS_KEY   = 'subbi_tagcolors_v1' + KEY_SUFFIX;

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
