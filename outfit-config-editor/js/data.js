const BODY_PARTS = ['head','face','upper','torso','arms','hands','waist','crotch','legs','feet','bodysuit'];

// Default placeholder values — semantically mapped to each body part slot
const BP_DEFAULTS = {
  head:     { normal: 'hat',      underwear: 'underhat',      wear_anim: '',             wear_time: 1.0, remove_anim: 'remove_hat',    remove_time: 1.0 },
  face:     { normal: 'glasses',  underwear: 'midwear',       wear_anim: 'wear_glasses', wear_time: 1.0, remove_anim: 'remove_glasses',remove_time: 1.0 },
  upper:    { normal: 'jacket',   underwear: 'midwear',       wear_anim: 'wear_top',     wear_time: 1.0, remove_anim: 'rem_top',        remove_time: 1.0 },
  torso:    { normal: 't-shirt',  underwear: 'undertop',      wear_anim: 'wear_top',     wear_time: 1.0, remove_anim: 'rem_top',        remove_time: 1.0 },
  arms:     { normal: 'sleeves',  underwear: 'undersleeves',  wear_anim: 'wear_arms',    wear_time: 1.0, remove_anim: 'rem_arms',       remove_time: 2.0 },
  hands:    { normal: 'gloves',   underwear: 'midwear',       wear_anim: 'wear_arms',    wear_time: 1.0, remove_anim: 'rem_arms',       remove_time: 2.0 },
  waist:    { normal: 'belt',     underwear: 'midwear',       wear_anim: '',             wear_time: 1.0, remove_anim: '',               remove_time: 1.0 },
  crotch:   { normal: 'pants',    underwear: 'underwear',     wear_anim: 'wear_bottom',  wear_time: 1.0, remove_anim: 'remove_pants',   remove_time: 1.5 },
  legs:     { normal: 'socks',    underwear: 'undersocks',    wear_anim: 'wear_bottom',  wear_time: 1.0, remove_anim: 'remove_pants',   remove_time: 1.5 },
  feet:     { normal: 'shoes',    underwear: 'socks',         wear_anim: 'wear_feet',    wear_time: 1.5, remove_anim: 'rem_feet',       remove_time: 1.7 },
  bodysuit: { normal: 'bodysuit', underwear: 'midwear',       wear_anim: '',             wear_time: 1.0, remove_anim: '',               remove_time: 1.0 },
};

const COLOR_PRESETS = [
  { label: 'Rainbow',  value: 'Rainbow' },
  { label: 'Random',   value: 'Random' },
  { label: 'RGB',      value: 'RGB' },
  { label: 'White',    value: '<1.0, 1.0, 1.0>' },
  { label: 'Black',    value: '<0.0, 0.0, 0.0>' },
  { label: 'Red',      value: '<1.0, 0.0, 0.0>' },
  { label: 'Green',    value: '<0.0, 1.0, 0.0>' },
  { label: 'Blue',     value: '<0.0, 0.0, 1.0>' },
  { label: 'Yellow',   value: '<1.0, 1.0, 0.0>' },
  { label: 'Cyan',     value: '<0.0, 1.0, 1.0>' },
  { label: 'Magenta',  value: '<1.0, 0.0, 1.0>' },
  { label: 'Orange',   value: '<1.0, 0.5, 0.0>' },
  { label: 'Pink',     value: '<1.0, 0.4, 0.7>' },
  { label: 'Purple',   value: '<0.5, 0.0, 0.5>' },
  { label: 'Gray',     value: '<0.5, 0.5, 0.5>' },
  { label: 'Skyblue',  value: 'Skyblue' },
];

const DEFAULT_OUTFIT = () => ({
  gender: 'Auto',
  animations_enabled: null,
  skelfix_change: null,
  skelfix_reload: null,
  nudity_permission: null,
  hairstyle_permission: null,
  clothes_permission: null,
  lock_ankles: null,
  pg_safe_mode: '',
  bodyparts: Object.fromEntries(BODY_PARTS.map(p => [p, {
    enabled: false,
    normal: '', underwear: '',
    wear_anim: '', wear_time: '',
    remove_anim: '', remove_time: ''
  }])),
  particles_enabled: null,
  particles_texture: '',
  particles_duration: 0.0,
  particles_color_start: '<1.0, 1.0, 1.0>',
  particles_color_end: '<1.0, 1.0, 1.0>',
  title_enabled: null,
  title_text: '',
  title_color: '<1.0, 1.0, 1.0>'
});
