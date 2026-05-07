/* ── Subbi Clothes Landing Page — i18n strings ── */

const SITE_LANGS = {
  en: {
    // Nav
    nav_guide:  "Guide",
    nav_editor: "Config Editor",
    nav_mp:     "Marketplace",

    // Hero
    hero_badge:    "RLV Wardrobe HUD · Second Life",
    hero_h1:       "Your clothes,<br><em>your rules.</em>",
    hero_sub:      "Subbi Clothes is a complete management and automation system for your Second Life wardrobe. Swap avatars, manage outfits, control who can interact — with animations, sounds, and particles on every change. Works with any body, any avatar.",
    hero_btn_mp:   "Get on Marketplace",
    hero_btn_guide:"Read the Guide",
    hero_rlv:      "Requires a viewer with <strong>RLVa support</strong> (e.g. Firestorm 7.2+) and RLV enabled.",

    // Pillars
    pillar1_h: "Immersion",
    pillar1_p: "Animations, sounds, and particle effects on every outfit change make your SL experience more alive.",
    pillar2_h: "Interactivity",
    pillar2_p: "Let others play with your wardrobe — avatars, dressing, undressing, hairstyles. Especially for couples.",
    pillar3_h: "Privacy & Management",
    pillar3_p: "Choose by category exactly what each person can do — public, friends, group, or individual level.",
    pillar4_h: "Security",
    pillar4_p: "PG-Safe+ dresses your avatar, revokes permissions, or replaces your look in restricted regions or AFK.",

    // Features
    feat_eyebrow: "What you get",
    feat_title:   "One HUD, complete control",
    feat1_h: "Clothing management",
    feat1_p: "Swap individual body part clothing states instantly. Go from dressed to underwear to undressed — per layer, per part, or all at once.",
    feat2_h: "Avatar & outfit swap",
    feat2_p: "Group your avatars and outfits, switch between them instantly. Random pick, mix body and clothes from different avatars, share access.",
    feat3_h: "Accessories system",
    feat3_p: "Attach and detach items individually. Auto-detect folders, subfolders, auto-detach on outfit change — organize your objects freely.",
    feat4_h: "Access control",
    feat4_p: "Whitelist and Blacklist, group access, minimum interaction distance, and per-category permissions for every HUD function.",
    feat5_h: "Full customization",
    feat5_p: "Message style, color, gender profiles, clothing names, notification preferences — everything configurable and saved per avatar.",
    feat6_h: "Any body, any avatar",
    feat6_p: "Works with any mesh body, any avatar type, any clothing — including BOM layers. Copy · Mod · Transfer.",

    // Getting Started
    howto_eyebrow: "Quick start",
    howto_title:   "Up and running in 4 steps",
    step1_h:    "Get the HUD",
    step1_p:    "Buy on the Marketplace. Copy · Mod · Transfer.",
    step1_link: "Marketplace",
    step2_h:    "Create your folders",
    step2_p:    "Run <strong>SAF v3</strong> — it builds your entire inventory structure automatically.",
    step3_h:    "Add your clothes",
    step3_p:    "Upload your avatars and outfits to the RLV folder (Firestorm recommended).",
    step4_h:    "Configure",
    step4_p:    "Use the <strong>Config Editor</strong> to set up animations, colors, and permissions.",
    step4_link: "Open editor",
    vid1_label: "<span>Step 2</span> — Creating folders with SAF",
    vid2_label: "<span>Step 3</span> — Uploading your avatar",

    // Use Cases
    uc_eyebrow: "Who is it for?",
    uc_title:   "Built for every style of play",
    uc1_h: "Couples & Social",
    uc1_p: "Let a partner control your wardrobe, swap your avatar, or undress you — with full permission control over exactly what they can and can't do.",
    uc2_h: "Roleplay & Immersion",
    uc2_p: "Wear animations, sounds, and particles on every clothing change. PG-Safe+ protects you automatically in restricted areas or when AFK.",
    uc3_h: "Events & DJs",
    uc3_p: "DJ Regions auto-adjusts your look when entering event venues. Quick Dress and Quick Undress for fast scene or stage changes.",
    uc4_h: "Wardrobe Management",
    uc4_p: "Dozens of avatars and outfits? Subbi Clothes groups, organizes, and switches them without leaving Second Life or opening a single folder.",

    // What's Included
    inc_eyebrow: "In the box",
    inc_h:       "Everything you need,<br>out of the box.",
    inc_p:       "No extra purchases, no separate tools to hunt down. The HUD package includes everything required to get started.",
    inc_btn:     "Get it on Marketplace",
    inc1_name: "Subbi Clothes HUD",      inc1_sub: "The main system",
    inc2_name: "Body Clicker",           inc2_sub: "For overhead messages and click interaction",
    inc3_name: "Extra Clickers",         inc3_sub: "For a more immersive experience",
    inc4_name: "SAF v3",                 inc4_sub: "Semi-Automatic Folders Creator",
    inc5_name: "Outfit Config Editor",   inc5_sub: "Free web tool — no install required",
    inc6_name: "Guide & personal support", inc6_sub: "Message Souwind or Aratx in SL",

    // Tools
    tools_eyebrow: "Free tools",
    tools_title:   "Made to make your life easier",
    oce_h:   "Visual Config Editor",
    oce_p:   "Configure your outfits visually — body parts, wear animations, timing, particles, permissions, and colors. Export a ready-to-paste config notecard without touching JSON by hand.",
    oce_li1: "All body parts & animation settings",
    oce_li2: "Color pickers with gradient & presets",
    oce_li3: "Import existing notecards",
    oce_li4: "English & Spanish interface",
    oce_btn: "Open Config Editor",
    saf_h:   "Semi-Automatic Folders Creator <span>v3</span>",
    saf_p:   "Sets up your entire Subbi Clothes folder structure directly inside your Second Life inventory — automatically. What used to take hours of manual work is done in minutes. Included in the HUD package.",

    // FAQ
    faq_eyebrow: "FAQ",
    faq_title:   "Common questions",
    faq1_q: "Does it work with my body / avatar?",
    faq1_a: "Yes. Subbi Clothes works with any mesh body, any avatar type, and any clothing — including BOM layers and alpha fixes. It is not locked to any specific body brand or system.",
    faq2_q: "Is RLV required?",
    faq2_a: "Yes. Subbi Clothes is an RLV HUD and requires a viewer with RLVa support — Firestorm 7.2 or higher is strongly recommended. You also need to have RLV enabled in your viewer settings.",
    faq3_q: "Do I need scripting knowledge?",
    faq3_a: "No. SAF v3 creates all the folders automatically. The Outfit Config Editor handles configuration visually. The initial setup takes 10–15 minutes following the guide.",
    faq4_q: "Can others interact with my HUD?",
    faq4_a: "Yes, and you have full control. You choose per category (clothes, avatars, accessories, hairstyle, nudity…) what each person — public, friends, group, or individual whitelist — can do.",
    faq5_q: "Where do I get help?",
    faq5_a: "Message <strong>Souwind</strong> or <strong>Aratx</strong> in Second Life. Personal support and constant updates are included.",
    faq6_q: "What version is current?",
    faq6_a: "The latest public release is <strong>v1.3.3 B4D</strong>. A new major version (<strong>DEV</strong>) is currently in active development. Owners can request redelivery via <code>/55 redelivery</code> in-world.",

    // Footer
    footer_contact: "Questions? Message <strong>Souwind</strong> or <strong>Aratx</strong> in Second Life.",
    footer_version: "Latest release: <strong>v1.3.3 B4D</strong> · DEV version in progress",
  },

  es: {
    // Nav
    nav_guide:  "Guía",
    nav_editor: "Editor de Config",
    nav_mp:     "Marketplace",

    // Hero
    hero_badge:    "HUD de Guardarropa RLV · Second Life",
    hero_h1:       "Tu ropa,<br><em>tus reglas.</em>",
    hero_sub:      "Subbi Clothes es un sistema completo de gestión y automatización para tu guardarropa de Second Life. Cambia avatares, gestiona outfits, controla quién puede interactuar — con animaciones, sonidos y partículas en cada cambio. Compatible con cualquier cuerpo y avatar.",
    hero_btn_mp:   "Obtener en Marketplace",
    hero_btn_guide:"Leer la Guía",
    hero_rlv:      "Requiere un visor con <strong>soporte RLVa</strong> (p.ej. Firestorm 7.2+) y RLV activado.",

    // Pillars
    pillar1_h: "Inmersión",
    pillar1_p: "Animaciones, sonidos y efectos de partículas en cada cambio de outfit hacen tu experiencia en SL más viva.",
    pillar2_h: "Interactividad",
    pillar2_p: "Deja que otros jueguen con tu guardarropa — avatares, vestir, desvestir, peinados. Especialmente para parejas.",
    pillar3_h: "Privacidad y Gestión",
    pillar3_p: "Elige por categoría exactamente qué puede hacer cada persona — público, amigos, grupo o nivel individual.",
    pillar4_h: "Seguridad",
    pillar4_p: "PG-Safe+ te viste, revoca permisos o reemplaza tu aspecto en regiones restringidas o cuando estás AFK.",

    // Features
    feat_eyebrow: "Lo que obtienes",
    feat_title:   "Un HUD, control total",
    feat1_h: "Gestión de ropa",
    feat1_p: "Cambia el estado de ropa de cada parte del cuerpo al instante. De vestido a ropa interior a desnudo — por capa, por parte o todo a la vez.",
    feat2_h: "Cambio de avatar y outfit",
    feat2_p: "Agrupa tus avatares y outfits, cambia entre ellos al instante. Selección aleatoria, mezcla cuerpo y ropa de distintos avatares, comparte acceso.",
    feat3_h: "Sistema de accesorios",
    feat3_p: "Adjunta y separa objetos individualmente. Detección automática de carpetas, subcarpetas, separación al cambiar de outfit — organiza tus objetos libremente.",
    feat4_h: "Control de acceso",
    feat4_p: "Lista blanca y lista negra, acceso por grupo, distancia mínima de interacción y permisos por categoría para cada función del HUD.",
    feat5_h: "Personalización total",
    feat5_p: "Estilo de mensajes, color, perfiles de género, nombres de ropa, preferencias de notificaciones — todo configurable y guardado por avatar.",
    feat6_h: "Cualquier cuerpo, cualquier avatar",
    feat6_p: "Compatible con cualquier cuerpo mesh, cualquier tipo de avatar y cualquier ropa — incluidas capas BOM. Copy · Mod · Transfer.",

    // Getting Started
    howto_eyebrow: "Inicio rápido",
    howto_title:   "En marcha en 4 pasos",
    step1_h:    "Obtén el HUD",
    step1_p:    "Cómpralo en el Marketplace. Copy · Mod · Transfer.",
    step1_link: "Marketplace",
    step2_h:    "Crea tus carpetas",
    step2_p:    "Ejecuta <strong>SAF v3</strong> — construye toda tu estructura de inventario automáticamente.",
    step3_h:    "Añade tu ropa",
    step3_p:    "Sube tus avatares y outfits a la carpeta RLV (Firestorm recomendado).",
    step4_h:    "Configura",
    step4_p:    "Usa el <strong>Editor de Config</strong> para configurar animaciones, colores y permisos.",
    step4_link: "Abrir editor",
    vid1_label: "<span>Paso 2</span> — Crear carpetas con SAF",
    vid2_label: "<span>Paso 3</span> — Subir tu avatar",

    // Use Cases
    uc_eyebrow: "¿Para quién es?",
    uc_title:   "Diseñado para cada estilo de juego",
    uc1_h: "Parejas y Social",
    uc1_p: "Deja que una pareja controle tu guardarropa, cambie tu avatar o te desvista — con control total de permisos sobre exactamente qué pueden y no pueden hacer.",
    uc2_h: "Roleplay e Inmersión",
    uc2_p: "Animaciones, sonidos y partículas en cada cambio de ropa. PG-Safe+ te protege automáticamente en zonas restringidas o cuando estás AFK.",
    uc3_h: "Eventos y DJs",
    uc3_p: "DJ Regions ajusta tu aspecto automáticamente al entrar en locales de eventos. Vestido y desvestido rápido para cambios de escena o escenario.",
    uc4_h: "Gestión de guardarropa",
    uc4_p: "¿Docenas de avatares y outfits? Subbi Clothes los agrupa, organiza y cambia sin salir de Second Life ni abrir una sola carpeta.",

    // What's Included
    inc_eyebrow: "En la caja",
    inc_h:       "Todo lo que necesitas,<br>desde el primer momento.",
    inc_p:       "Sin compras extra, sin herramientas adicionales que buscar. El paquete del HUD incluye todo lo necesario para empezar.",
    inc_btn:     "Obtenerlo en Marketplace",
    inc1_name: "Subbi Clothes HUD",       inc1_sub: "El sistema principal",
    inc2_name: "Body Clicker",            inc2_sub: "Para mensajes sobre la cabeza e interacción por clic",
    inc3_name: "Extra Clickers",          inc3_sub: "Para una experiencia más inmersiva",
    inc4_name: "SAF v3",                  inc4_sub: "Creador Semi-Automático de Carpetas",
    inc5_name: "Outfit Config Editor",    inc5_sub: "Herramienta web gratuita — sin instalación",
    inc6_name: "Guía y soporte personal", inc6_sub: "Escribe a Souwind o Aratx en SL",

    // Tools
    tools_eyebrow: "Herramientas gratuitas",
    tools_title:   "Diseñadas para facilitarte la vida",
    oce_h:   "Editor Visual de Config",
    oce_p:   "Configura tus outfits visualmente — partes del cuerpo, animaciones, tiempos, partículas, permisos y colores. Exporta una notecard lista para pegar sin tocar el JSON a mano.",
    oce_li1: "Todas las partes del cuerpo y ajustes de animación",
    oce_li2: "Selectores de color con gradiente y predefinidos",
    oce_li3: "Importar notecards existentes",
    oce_li4: "Interfaz en inglés y español",
    oce_btn: "Abrir Editor de Config",
    saf_h:   "Creador Semi-Automático de Carpetas <span>v3</span>",
    saf_p:   "Configura toda la estructura de carpetas de Subbi Clothes directamente en tu inventario de Second Life — automáticamente. Lo que antes llevaba horas de trabajo manual se hace en minutos. Incluido en el paquete del HUD.",

    // FAQ
    faq_eyebrow: "FAQ",
    faq_title:   "Preguntas frecuentes",
    faq1_q: "¿Funciona con mi cuerpo / avatar?",
    faq1_a: "Sí. Subbi Clothes funciona con cualquier cuerpo mesh, cualquier tipo de avatar y cualquier ropa — incluidas capas BOM y alpha fixes. No está vinculado a ninguna marca de cuerpo o sistema específico.",
    faq2_q: "¿Es obligatorio RLV?",
    faq2_a: "Sí. Subbi Clothes es un HUD RLV y requiere un visor con soporte RLVa — se recomienda Firestorm 7.2 o superior. También necesitas tener RLV activado en los ajustes de tu visor.",
    faq3_q: "¿Necesito conocimientos de scripting?",
    faq3_a: "No. SAF v3 crea todas las carpetas automáticamente. El Outfit Config Editor gestiona la configuración de forma visual. La configuración inicial lleva 10–15 minutos siguiendo la guía.",
    faq4_q: "¿Pueden otros interactuar con mi HUD?",
    faq4_a: "Sí, y tienes control total. Eliges por categoría (ropa, avatares, accesorios, peinado, desnudez…) qué puede hacer cada persona — público, amigos, grupo o lista blanca individual.",
    faq5_q: "¿Dónde obtengo ayuda?",
    faq5_a: "Escribe a <strong>Souwind</strong> o <strong>Aratx</strong> en Second Life. El soporte personal y las actualizaciones constantes están incluidos.",
    faq6_q: "¿Cuál es la versión actual?",
    faq6_a: "La última versión pública es <strong>v1.3.3 B4D</strong>. Una nueva versión mayor (<strong>DEV</strong>) está en desarrollo activo. Los propietarios pueden solicitar reenvío con <code>/55 redelivery</code> en el mundo.",

    // Footer
    footer_contact: "¿Preguntas? Escribe a <strong>Souwind</strong> o <strong>Aratx</strong> en Second Life.",
    footer_version: "Última versión: <strong>v1.3.3 B4D</strong> · Versión DEV en desarrollo",
  }
};

function setLang(lang) {
  if (!SITE_LANGS[lang]) lang = 'en';
  document.documentElement.lang = lang;
  try { localStorage.setItem('site_lang', lang); } catch(e) {}

  const s = SITE_LANGS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = s[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = s[el.dataset.i18nHtml];
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('lang-active', btn.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let saved = 'en';
  try { saved = localStorage.getItem('site_lang') || 'en'; } catch(e) {}
  setLang(saved);
});
