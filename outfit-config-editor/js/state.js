let lang = 'en';
let outfits = [];
let groups = [];
let activeId = null;
let activeMode = 'outfit'; // 'outfit' | 'group'
let importing = false;
let pendingDeleteId = null;
let renameTargetId = null;
let pendingDeleteGroupId = null;
let renameGroupTargetId = null;
let groupDeleteClickGroupId = null;
let groupDeleteClickCount = 0;
let groupByGroup = true;
let compactSidebar = false;
let bpAnimColsVisible = false;
let tagColors = {};
let saveTimer;
let notifyTimer;
