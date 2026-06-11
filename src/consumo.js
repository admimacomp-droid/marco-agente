// ============================================================
// consumo.js — Base de conocimiento y calculadora de consumo
// de aire comprimido — IMACOMP Inteligencia Consultiva
// ============================================================
// Valores de REFERENCIA basados en estándares de la industria:
// - Herramientas: consumo de aire libre (FAD) a ~90 PSI / 6.2 bar
// - Máquinas: rangos típicos de fichas técnicas de mercado
// La ficha técnica del fabricante específico SIEMPRE manda.
// Marco debe aclararlo en cada cálculo.
// ============================================================

const CFM_A_LMIN = 28.3168; // 1 CFM = 28.3168 l/min

// ============================================================
// CATÁLOGO DE CONSUMIDORES DE AIRE COMPRIMIDO
// Organizado por categorías. consumo_cfm = uso continuo típico.
// ciclo_trabajo = fracción del tiempo que consume cuando está "en uso"
//   (herramientas manuales ~0.25-0.5; máquinas automáticas ~0.8-1.0)
// ============================================================
export const HERRAMIENTAS = {

  // ===== TALLER MECÁNICO / AUTOMOTRIZ =====
  "llave_impacto_3_8":    { nombre: "Llave de impacto 3/8\"",            consumo_cfm: 3,   presion_bar: 6.2, ciclo: 0.25, cat: "automotriz" },
  "llave_impacto_1_2":    { nombre: "Llave de impacto 1/2\"",            consumo_cfm: 5,   presion_bar: 6.2, ciclo: 0.25, cat: "automotriz" },
  "llave_impacto_3_4":    { nombre: "Llave de impacto 3/4\"",            consumo_cfm: 8,   presion_bar: 6.2, ciclo: 0.25, cat: "automotriz" },
  "llave_impacto_1":      { nombre: "Llave de impacto 1\"",              consumo_cfm: 12,  presion_bar: 6.2, ciclo: 0.3,  cat: "automotriz" },
  "carraca_neumatica":    { nombre: "Carraca/ratchet neumática",         consumo_cfm: 4,   presion_bar: 6.2, ciclo: 0.25, cat: "automotriz" },
  "pistola_soplado":      { nombre: "Pistola de soplado/limpieza",       consumo_cfm: 3,   presion_bar: 6.2, ciclo: 0.2,  cat: "general" },
  "inflador_neumaticos":  { nombre: "Inflador de neumáticos",            consumo_cfm: 2,   presion_bar: 8,   ciclo: 0.2,  cat: "automotriz" },
  "pistola_grasa":        { nombre: "Engrasadora neumática",             consumo_cfm: 4,   presion_bar: 6.2, ciclo: 0.3,  cat: "automotriz" },

  // ===== PINTURA Y ACABADOS =====
  "pistola_pintura_hvlp": { nombre: "Pistola de pintura HVLP",           consumo_cfm: 10,  presion_bar: 2.5, ciclo: 0.6,  cat: "pintura" },
  "pistola_pintura_conv": { nombre: "Pistola de pintura convencional",   consumo_cfm: 12,  presion_bar: 4,   ciclo: 0.6,  cat: "pintura" },
  "pistola_electrostatica_liq": { nombre: "Pistola electrostática (pintura líquida)", consumo_cfm: 8, presion_bar: 3, ciclo: 0.7, cat: "pintura" },
  "pistola_electrostatica_polvo": { nombre: "Pistola electrostática (recubrimiento en polvo)", consumo_cfm: 5, presion_bar: 1, ciclo: 0.8, cat: "pintura" },
  "pistola_airless_asistida": { nombre: "Pistola airless asistida por aire", consumo_cfm: 7, presion_bar: 3.5, ciclo: 0.6, cat: "pintura" },
  "olla_presion_pintura": { nombre: "Tanque/olla de presión para pintura", consumo_cfm: 8, presion_bar: 3.5, ciclo: 0.7, cat: "pintura" },
  "cabina_pintura":       { nombre: "Cabina de pintura presurizada (línea de aire)", consumo_cfm: 15, presion_bar: 6, ciclo: 0.8, cat: "pintura" },
  "aerografo":            { nombre: "Aerógrafo",                         consumo_cfm: 1,   presion_bar: 2,   ciclo: 0.5,  cat: "pintura" },

  // ===== LIJADO Y PULIDO =====
  "lijadora_orbital":     { nombre: "Lijadora orbital neumática",        consumo_cfm: 9,   presion_bar: 6.2, ciclo: 0.5,  cat: "acabado" },
  "lijadora_roto":        { nombre: "Lijadora rotorbital",               consumo_cfm: 11,  presion_bar: 6.2, ciclo: 0.5,  cat: "acabado" },
  "lijadora_banda":       { nombre: "Lijadora de banda neumática",       consumo_cfm: 10,  presion_bar: 6.2, ciclo: 0.5,  cat: "acabado" },
  "pulidora":             { nombre: "Pulidora neumática",                consumo_cfm: 8,   presion_bar: 6.2, ciclo: 0.5,  cat: "acabado" },

  // ===== CORTE Y DESBASTE =====
  "amoladora_recta":      { nombre: "Amoladora/esmeril recto",           consumo_cfm: 6,   presion_bar: 6.2, ciclo: 0.4,  cat: "metalmecanica" },
  "amoladora_angular":    { nombre: "Amoladora angular 7\"",             consumo_cfm: 8,   presion_bar: 6.2, ciclo: 0.4,  cat: "metalmecanica" },
  "cortadora_chapa":      { nombre: "Cortadora/cizalla de chapa",        consumo_cfm: 7,   presion_bar: 6.2, ciclo: 0.4,  cat: "metalmecanica" },
  "sierra_neumatica":     { nombre: "Sierra neumática",                  consumo_cfm: 6,   presion_bar: 6.2, ciclo: 0.4,  cat: "metalmecanica" },
  "plasma_corte":         { nombre: "Equipo de corte por plasma",        consumo_cfm: 12,  presion_bar: 6,   ciclo: 0.6,  cat: "metalmecanica" },

  // ===== PERFORACIÓN Y FIJACIÓN =====
  "taladro_neumatico":    { nombre: "Taladro neumático",                 consumo_cfm: 4,   presion_bar: 6.2, ciclo: 0.3,  cat: "general" },
  "atornillador":         { nombre: "Atornillador neumático",            consumo_cfm: 3,   presion_bar: 6.2, ciclo: 0.3,  cat: "ensamble" },
  "remachadora":          { nombre: "Remachadora neumática",             consumo_cfm: 4,   presion_bar: 6.2, ciclo: 0.2,  cat: "ensamble" },
  "clavadora":            { nombre: "Clavadora neumática",               consumo_cfm: 2,   presion_bar: 6.2, ciclo: 0.15, cat: "carpinteria" },
  "grapadora":            { nombre: "Grapadora neumática",               consumo_cfm: 2,   presion_bar: 6.2, ciclo: 0.15, cat: "carpinteria" },

  // ===== DEMOLICIÓN Y MINERÍA =====
  "martillo_neumatico":   { nombre: "Martillo neumático/picador",        consumo_cfm: 12,  presion_bar: 6.2, ciclo: 0.6,  cat: "construccion" },
  "rompepavimento":       { nombre: "Rompepavimento neumático",          consumo_cfm: 40,  presion_bar: 6.2, ciclo: 0.6,  cat: "construccion" },
  "perforador_roca":      { nombre: "Perforador de roca (jackleg)",      consumo_cfm: 90,  presion_bar: 6.2, ciclo: 0.7,  cat: "mineria" },
  "vibrador_concreto":    { nombre: "Vibrador de concreto neumático",    consumo_cfm: 12,  presion_bar: 6.2, ciclo: 0.5,  cat: "construccion" },

  // ===== GRANALLADO / ARENADO (chorro abrasivo) =====
  // El consumo depende fuertemente del diámetro de boquilla y presión.
  // Valores a 7 bar aprox. Boquillas mayores = consumo mucho mayor.
  "arenadora_boquilla_3mm":  { nombre: "Arenadora/granalladora boquilla 1/8\" (3.2mm)",  consumo_cfm: 25,  presion_bar: 7, ciclo: 0.8, cat: "tratamiento_superficies" },
  "arenadora_boquilla_5mm":  { nombre: "Arenadora/granalladora boquilla 3/16\" (4.8mm)", consumo_cfm: 55,  presion_bar: 7, ciclo: 0.8, cat: "tratamiento_superficies" },
  "arenadora_boquilla_6mm":  { nombre: "Arenadora/granalladora boquilla 1/4\" (6.4mm)",  consumo_cfm: 95,  presion_bar: 7, ciclo: 0.8, cat: "tratamiento_superficies" },
  "arenadora_boquilla_8mm":  { nombre: "Arenadora/granalladora boquilla 5/16\" (8mm)",   consumo_cfm: 150, presion_bar: 7, ciclo: 0.8, cat: "tratamiento_superficies" },
  "arenadora_boquilla_9mm":  { nombre: "Arenadora/granalladora boquilla 3/8\" (9.5mm)",  consumo_cfm: 220, presion_bar: 7, ciclo: 0.8, cat: "tratamiento_superficies" },
  "cabina_granallado":       { nombre: "Cabina de granallado (sistema Venturi/aspiración)", consumo_cfm: 20, presion_bar: 6, ciclo: 0.8, cat: "tratamiento_superficies" },
  "shot_peening":            { nombre: "Equipo de shot peening",          consumo_cfm: 60,  presion_bar: 7, ciclo: 0.8, cat: "tratamiento_superficies" },
  "aerogomado":              { nombre: "Equipo de aerogomado/hidrogomado", consumo_cfm: 18, presion_bar: 8, ciclo: 0.8, cat: "tratamiento_superficies" },

  // ===== MÁQUINAS AUTOMÁTICAS / LÍNEA DE PRODUCCIÓN =====
  // Consumo estable, ciclo de trabajo alto (operación continua)
  "cilindro_neumatico":   { nombre: "Cilindro neumático estándar (por unidad, ciclo típico)", consumo_cfm: 2, presion_bar: 6, ciclo: 0.9, cat: "automatizacion" },
  "prensa_neumatica":     { nombre: "Prensa neumática de banco",         consumo_cfm: 6,   presion_bar: 6,   ciclo: 0.7,  cat: "automatizacion" },
  "robot_pick_place":     { nombre: "Robot/manipulador pick & place",    consumo_cfm: 5,   presion_bar: 6,   ciclo: 0.9,  cat: "automatizacion" },
  "envasadora":           { nombre: "Envasadora/llenadora automática",   consumo_cfm: 15,  presion_bar: 6,   ciclo: 0.9,  cat: "alimentos" },
  "selladora_bolsas":     { nombre: "Selladora de bolsas neumática",     consumo_cfm: 4,   presion_bar: 6,   ciclo: 0.8,  cat: "alimentos" },
  "etiquetadora":         { nombre: "Etiquetadora automática",           consumo_cfm: 5,   presion_bar: 6,   ciclo: 0.9,  cat: "alimentos" },
  "transporte_neumatico": { nombre: "Transporte neumático de sólidos (granos/polvos)", consumo_cfm: 100, presion_bar: 2.5, ciclo: 0.9, cat: "alimentos" },
  "sopladora_pet":        { nombre: "Sopladora de botellas PET (alta presión)", consumo_cfm: 120, presion_bar: 30, ciclo: 0.9, cat: "plasticos", nota: "Requiere compresor de alta presión (25-40 bar), tecnología distinta" },
  "inyectora_plastico":   { nombre: "Inyectora de plástico (servicios neumáticos)", consumo_cfm: 10, presion_bar: 6, ciclo: 0.8, cat: "plasticos" },
  "termoformadora":       { nombre: "Termoformadora",                    consumo_cfm: 20,  presion_bar: 6,   ciclo: 0.8,  cat: "plasticos" },
  "cnc_servicios":        { nombre: "Centro CNC (limpieza y accionamientos)", consumo_cfm: 8, presion_bar: 6, ciclo: 0.7, cat: "metalmecanica" },
  "torno_cnc":            { nombre: "Torno CNC (servicios de aire)",     consumo_cfm: 6,   presion_bar: 6,   ciclo: 0.7,  cat: "metalmecanica" },
  "laser_corte_asistido": { nombre: "Láser de corte (aire de asistencia)", consumo_cfm: 35, presion_bar: 10, ciclo: 0.8, cat: "metalmecanica", nota: "Algunos equipos requieren 10-16 bar de aire limpio y seco" },

  // ===== EQUIPOS DENTALES / MÉDICOS / LABORATORIO =====
  "sillon_dental":        { nombre: "Sillón/unidad dental (por puesto)", consumo_cfm: 2,   presion_bar: 5.5, ciclo: 0.5,  cat: "dental", nota: "Requiere aire oil-free grado médico" },
  "instrumental_lab":     { nombre: "Instrumental de laboratorio (por punto)", consumo_cfm: 1.5, presion_bar: 5, ciclo: 0.5, cat: "laboratorio", nota: "Requiere aire oil-free, seco" },

  // ===== TEXTILES =====
  "telar_aire":           { nombre: "Telar de chorro de aire (air-jet)", consumo_cfm: 40,  presion_bar: 6,   ciclo: 0.95, cat: "textil" },
  "maquina_coser_ind":    { nombre: "Máquina de coser industrial (asistencia neumática)", consumo_cfm: 1.5, presion_bar: 5, ciclo: 0.6, cat: "textil" },
};

// ============================================================
// FACTORES DE SIMULTANEIDAD POR INDUSTRIA
// Fracción de los consumidores operando a la vez, según patrón
// típico de uso de cada sector. Si el cliente da su propio dato,
// ese manda.
// ============================================================
export const SIMULTANEIDAD_POR_INDUSTRIA = {
  taller_automotriz:        { factor: 0.45, nota: "Herramientas de uso intermitente; pocas operan a la vez." },
  metalmecanica:            { factor: 0.55, nota: "Mezcla de herramientas manuales y máquinas semi-continuas." },
  pintura_acabados:         { factor: 0.70, nota: "Pistolas en uso sostenido durante jornadas de aplicación." },
  tratamiento_superficies:  { factor: 0.90, nota: "Granallado/arenado: consumo casi continuo durante operación." },
  construccion:             { factor: 0.60, nota: "Equipos de demolición con uso prolongado." },
  mineria:                  { factor: 0.80, nota: "Perforación y equipos de uso intensivo continuo." },
  alimentos_bebidas:        { factor: 0.85, nota: "Líneas automáticas de operación continua." },
  plasticos:                { factor: 0.85, nota: "Máquinas de proceso continuo." },
  farmaceutica:             { factor: 0.80, nota: "Procesos automatizados continuos, aire oil-free." },
  dental_clinicas:          { factor: 0.50, nota: "No todos los sillones operan a la vez." },
  textil:                   { factor: 0.90, nota: "Telares de operación continua." },
  carpinteria_mueble:       { factor: 0.40, nota: "Herramientas de fijación de uso intermitente." },
  general:                  { factor: 0.65, nota: "Valor genérico cuando no se conoce el sector." },
};

// Fallback por cantidad de consumidores (si no se conoce la industria)
const SIMULTANEIDAD_POR_CANTIDAD = { 1: 1.0, 2: 0.85, 3: 0.75, 4: 0.70, 5: 0.65, default: 0.60 };

// Factor de servicio estándar: margen por fugas de línea, desgaste y
// crecimiento futuro. Industria recomienda 1.25–1.5; usamos 1.30.
const FACTOR_SERVICIO_DEFECTO = 1.30;

// ============================================================
// CÁLCULO DE CONSUMO PROYECTADO
// ============================================================
export function calcularConsumo({ items = [], industria, factor_simultaneidad, factor_servicio }) {
  const detalle = [];
  const notas = [];
  let sumaBruta = 0;
  let presionMax = 0;
  let requiereOilFree = false;
  let requiereAltaPresion = false;

  for (const item of items) {
    const cantidad = item.cantidad || 1;
    let info = null;

    if (item.id && HERRAMIENTAS[item.id]) {
      info = HERRAMIENTAS[item.id];
    } else if (item.nombre) {
      info = buscarHerramienta(item.nombre);
    }

    const consumo = info?.consumo_cfm ?? item.consumo_cfm;
    const presion = info?.presion_bar ?? item.presion_bar ?? 6.2;
    const nombre = info?.nombre ?? item.nombre ?? "Equipo sin identificar";

    if (info?.nota) notas.push(`${nombre}: ${info.nota}`);
    if (info?.cat === "dental" || info?.cat === "laboratorio" || info?.cat === "farmaceutica") requiereOilFree = true;
    if (presion > 12) requiereAltaPresion = true;

    if (consumo == null) {
      detalle.push({ nombre, cantidad, nota: "Sin dato de consumo en la base; solicitar ficha técnica al cliente." });
      continue;
    }

    const subtotal = consumo * cantidad;
    sumaBruta += subtotal;
    if (presion > presionMax && presion <= 12) presionMax = presion; // alta presión se trata aparte
    detalle.push({ nombre, cantidad, consumo_unit_cfm: consumo, subtotal_cfm: subtotal, presion_bar: presion });
  }

  // Factor de simultaneidad: prioridad cliente > industria > cantidad
  let fSimul, origenSimul;
  if (factor_simultaneidad) {
    fSimul = factor_simultaneidad; origenSimul = "definido por el cliente";
  } else if (industria && SIMULTANEIDAD_POR_INDUSTRIA[normalizar(industria).replace(/ /g, "_")]) {
    const ind = SIMULTANEIDAD_POR_INDUSTRIA[normalizar(industria).replace(/ /g, "_")];
    fSimul = ind.factor; origenSimul = `típico de la industria (${ind.nota})`;
  } else if (industria) {
    // intento de match parcial de industria
    const key = Object.keys(SIMULTANEIDAD_POR_INDUSTRIA).find((k) => normalizar(industria).includes(k.split("_")[0]));
    if (key) {
      fSimul = SIMULTANEIDAD_POR_INDUSTRIA[key].factor;
      origenSimul = `típico del sector ${key} (${SIMULTANEIDAD_POR_INDUSTRIA[key].nota})`;
    }
  }
  if (!fSimul) {
    const nTotal = items.reduce((a, i) => a + (i.cantidad || 1), 0);
    fSimul = SIMULTANEIDAD_POR_CANTIDAD[nTotal] ?? SIMULTANEIDAD_POR_CANTIDAD.default;
    origenSimul = "estimado por cantidad de equipos";
  }

  const fServicio = factor_servicio ?? FACTOR_SERVICIO_DEFECTO;
  const consumoSimultaneo = sumaBruta * fSimul;
  const consumoProyectado = consumoSimultaneo * fServicio;
  const presionRecomendada = round((presionMax || 6.2) + 1, 1);

  if (requiereOilFree) notas.push("Aplicación requiere aire libre de aceite (oil-free): línea MAXTOP recomendada.");
  if (requiereAltaPresion) notas.push("Incluye equipos de ALTA PRESIÓN (>12 bar): requieren compresor/booster especial, dimensionar por separado.");

  return {
    detalle,
    suma_bruta_cfm: round(sumaBruta),
    suma_bruta_lmin: round(sumaBruta * CFM_A_LMIN, 0),
    factor_simultaneidad: fSimul,
    origen_factor_simultaneidad: origenSimul,
    consumo_simultaneo_cfm: round(consumoSimultaneo),
    factor_servicio: fServicio,
    consumo_proyectado_cfm: round(consumoProyectado),
    consumo_proyectado_lmin: round(consumoProyectado * CFM_A_LMIN, 0),
    consumo_proyectado_m3min: round(consumoProyectado * CFM_A_LMIN / 1000, 2),
    presion_requerida_bar: presionRecomendada,
    notas,
    explicacion:
      `Suma bruta de todos los equipos: ${round(sumaBruta)} CFM (${round(sumaBruta * CFM_A_LMIN, 0)} l/min). ` +
      `Factor de simultaneidad ${fSimul} (${origenSimul}): ${round(consumoSimultaneo)} CFM operando realmente a la vez. ` +
      `Factor de servicio ${fServicio} (margen por fugas de línea y crecimiento futuro): ` +
      `CONSUMO PROYECTADO ${round(consumoProyectado)} CFM = ${round(consumoProyectado * CFM_A_LMIN, 0)} l/min = ${round(consumoProyectado * CFM_A_LMIN / 1000, 2)} m³/min. ` +
      `Presión recomendada del compresor: ${presionRecomendada} bar (presión de trabajo máxima + 1 bar por pérdidas de red). ` +
      `Valores de referencia de la industria; las fichas técnicas de los fabricantes específicos mandan.`,
  };
}

// ============================================================
// Utilidades
// ============================================================
// Búsqueda por puntaje: la entrada del usuario se separa en palabras
// y se elige la herramienta cuyo nombre+id matchee más palabras.
function buscarHerramienta(nombreUsuario) {
  const palabras = normalizar(nombreUsuario).split(/[\s\/"-]+/).filter((p) => p.length > 1);
  if (!palabras.length) return null;

  let mejor = null;
  let mejorPuntaje = 0;

  for (const [id, h] of Object.entries(HERRAMIENTAS)) {
    const texto = normalizar(h.nombre + " " + id.replace(/_/g, " "));
    let puntaje = 0;
    for (const p of palabras) {
      if (texto.includes(p)) puntaje++;
    }
    // bonus si todas las palabras del usuario están presentes
    if (puntaje === palabras.length) puntaje += 2;
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = h;
    }
  }
  // exigir al menos 1 palabra coincidente significativa
  return mejorPuntaje >= 1 ? mejor : null;
}

function normalizar(s) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // sin tildes
    .trim();
}

function round(n, dec = 1) {
  const f = Math.pow(10, dec);
  return Math.round(n * f) / f;
}

export function listarHerramientas(categoria) {
  return Object.entries(HERRAMIENTAS)
    .filter(([, h]) => !categoria || h.cat === categoria)
    .map(([id, h]) => ({ id, nombre: h.nombre, consumo_cfm: h.consumo_cfm, presion_bar: h.presion_bar, categoria: h.cat }));
}

export function listarIndustrias() {
  return Object.entries(SIMULTANEIDAD_POR_INDUSTRIA)
    .map(([id, v]) => ({ industria: id, factor: v.factor, nota: v.nota }));
}
