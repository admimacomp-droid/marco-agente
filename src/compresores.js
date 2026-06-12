// ============================================================
// compresores.js — Catálogo técnico real IMACOMP
// Marcas cargadas: UNITED OSD/UCS (completo), KRATTO (datos de referencia).
// MAXTOP: PENDIENTE de cargar ficha técnica real.
// Datos extraídos de fichas técnicas oficiales (2024-2026).
// SIN precios (los maneja el equipo de ventas).
// ============================================================
// Campos por modelo:
//   modelo        nombre comercial
//   marca         KRATTO | UNITED | MAXTOP
//   caudal_cfm    caudal de aire libre (FAD) en CFM
//   caudal_lmin   mismo caudal en l/min
//   presion_bar   presión de trabajo/máxima de referencia (bar)
//   potencia_hp   potencia en HP (si aplica)
//   potencia_kw   potencia en kW
//   tipo          tornillo | tornillo_2etapas | piston | secador | estanque
//   oil_free      true si es libre de aceite
//   segmento      pyme | industrial | premium_industrial | oil_free_critico
//   etapas        1 | 2 (compresores de tornillo)
//   nota          observaciones de aplicación
// ============================================================

export const COMPRESORES = [
  // ==========================================================
  // KRATTO — PYME, talleres, industria liviana/media
  // Caudales tomados de ficha; presión máx 10 bar.
  // ==========================================================
  // --- Tornillo con estanque (4 EN 1: compresor+secador+filtros+estanque) ---
  { modelo: "KRXD 10/500 (4 EN 1)", marca: "KRATTO", caudal_cfm: 31.8,  caudal_lmin: 900,   presion_bar: 10, potencia_hp: 10,  potencia_kw: 7.5,  tipo: "tornillo", oil_free: false, segmento: "pyme", etapas: 1, nota: "Equipo integral con secador, filtros y estanque 500 L. Ideal para talleres que buscan solución completa lista para usar." },
  { modelo: "KRXD 15/500 (4 EN 1)", marca: "KRATTO", caudal_cfm: 45.9,  caudal_lmin: 1300,  presion_bar: 10, potencia_hp: 15,  potencia_kw: 11,   tipo: "tornillo", oil_free: false, segmento: "pyme", etapas: 1, nota: "Equipo integral con secador, filtros y estanque 500 L." },
  { modelo: "KRXD 20/500 (4 EN 1)", marca: "KRATTO", caudal_cfm: 74.15, caudal_lmin: 2100,  presion_bar: 10, potencia_hp: 20,  potencia_kw: 15,   tipo: "tornillo", oil_free: false, segmento: "pyme", etapas: 1, nota: "Equipo integral con secador, filtros y estanque 500 L." },
  // --- Tornillo sin estanque ---
  { modelo: "KRX 10",  marca: "KRATTO", caudal_cfm: 31.8,  caudal_lmin: 900,   presion_bar: 10, potencia_hp: 10,  potencia_kw: 7.5,  tipo: "tornillo", oil_free: false, segmento: "pyme", etapas: 1, nota: "Compresor de tornillo compacto, requiere estanque y secador por separado." },
  { modelo: "KRX 15",  marca: "KRATTO", caudal_cfm: 45.9,  caudal_lmin: 1300,  presion_bar: 10, potencia_hp: 15,  potencia_kw: 11,   tipo: "tornillo", oil_free: false, segmento: "pyme", etapas: 1 },
  { modelo: "KRX 20",  marca: "KRATTO", caudal_cfm: 74.15, caudal_lmin: 2100,  presion_bar: 10, potencia_hp: 20,  potencia_kw: 15,   tipo: "tornillo", oil_free: false, segmento: "pyme", etapas: 1 },
  { modelo: "KRX 30",  marca: "KRATTO", caudal_cfm: 123,   caudal_lmin: 3200,  presion_bar: 10, potencia_hp: 30,  potencia_kw: 22,   tipo: "tornillo", oil_free: false, segmento: "industrial", etapas: 1 },
  { modelo: "KRX 50",  marca: "KRATTO", caudal_cfm: 197.7, caudal_lmin: 5600,  presion_bar: 10, potencia_hp: 50,  potencia_kw: 37,   tipo: "tornillo", oil_free: false, segmento: "industrial", etapas: 1 },
  { modelo: "KRX 60",  marca: "KRATTO", caudal_cfm: 219,   caudal_lmin: 6200,  presion_bar: 10, potencia_hp: 60,  potencia_kw: 45,   tipo: "tornillo", oil_free: false, segmento: "industrial", etapas: 1 },
  { modelo: "KRX 100", marca: "KRATTO", caudal_cfm: 395.5, caudal_lmin: 11200, presion_bar: 10, potencia_hp: 100, potencia_kw: 75,   tipo: "tornillo", oil_free: false, segmento: "industrial", etapas: 1 },
  // --- Compresores de pistón KRATTO (entrada de gama) ---
  { modelo: "KPX 3/100", marca: "KRATTO", caudal_cfm: 15, caudal_lmin: 418, presion_bar: 10, potencia_hp: 3, potencia_kw: 2.2, tipo: "piston", oil_free: false, segmento: "pyme", etapas: 1, nota: "Pistón con estanque 100 L. Uso intermitente, talleres pequeños." },
  { modelo: "KPX 3/200", marca: "KRATTO", caudal_cfm: 15, caudal_lmin: 418, presion_bar: 10, potencia_hp: 3, potencia_kw: 2.2, tipo: "piston", oil_free: false, segmento: "pyme", etapas: 1, nota: "Pistón con estanque 200 L. Uso intermitente." },
  { modelo: "KPX 3/270", marca: "KRATTO", caudal_cfm: 15, caudal_lmin: 418, presion_bar: 10, potencia_hp: 3, potencia_kw: 2.2, tipo: "piston", oil_free: false, segmento: "pyme", etapas: 1, nota: "Pistón con estanque 270 L. Uso intermitente." },

  // ==========================================================
  // UNITED OSD / UCS — Industrial premium (J/V Hitachi)
  // Caudales originales en m³/min → CFM (×35.3147).
  // Tornillo 1 etapa, presiones según columna 0.8 MPa (8 bar).
  // ==========================================================
  // --- UD-VPM una etapa, imán permanente velocidad variable (a 8 bar / 0.8 MPa) ---
  { modelo: "UD5A-VPM",  marca: "UNITED", caudal_cfm: 32.5,  caudal_lmin: 920,   presion_bar: 8, potencia_hp: 7.5,  potencia_kw: 5.5,  tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable, ahorro energético. Caudal a 8 bar." },
  { modelo: "UD8A-VPM",  marca: "UNITED", caudal_cfm: 39.6,  caudal_lmin: 1120,  presion_bar: 8, potencia_hp: 10,   potencia_kw: 7.5,  tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD11A-VPM", marca: "UNITED", caudal_cfm: 65.0,  caudal_lmin: 1840,  presion_bar: 8, potencia_hp: 15,   potencia_kw: 11,   tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD15A-VPM", marca: "UNITED", caudal_cfm: 84.8,  caudal_lmin: 2400,  presion_bar: 8, potencia_hp: 20,   potencia_kw: 15,   tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD18A-VPM", marca: "UNITED", caudal_cfm: 113.0, caudal_lmin: 3200,  presion_bar: 8, potencia_hp: 25,   potencia_kw: 18.5, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD22A-VPM", marca: "UNITED", caudal_cfm: 130.6, caudal_lmin: 3700,  presion_bar: 8, potencia_hp: 30,   potencia_kw: 22,   tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD30A-VPM", marca: "UNITED", caudal_cfm: 187.2, caudal_lmin: 5300,  presion_bar: 8, potencia_hp: 40,   potencia_kw: 30,   tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD37A-VPM", marca: "UNITED", caudal_cfm: 236.6, caudal_lmin: 6700,  presion_bar: 8, potencia_hp: 50,   potencia_kw: 37,   tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD45A-VPM", marca: "UNITED", caudal_cfm: 286.0, caudal_lmin: 8100,  presion_bar: 8, potencia_hp: 60,   potencia_kw: 45,   tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  { modelo: "UD55A-VPM", marca: "UNITED", caudal_cfm: 370.8, caudal_lmin: 10500, presion_bar: 8, potencia_hp: 75,   potencia_kw: 55,   tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Imán permanente velocidad variable." },
  // --- UD-VFD una etapa, velocidad variable, mayor potencia (a 8 bar) ---
  { modelo: "UD75-VFD",  marca: "UNITED", caudal_cfm: 409.6,  caudal_lmin: 11600, presion_bar: 8, potencia_hp: 100, potencia_kw: 75,  tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "Velocidad variable, gran caudal industrial." },
  { modelo: "UD90-VFD",  marca: "UNITED", caudal_cfm: 565.0,  caudal_lmin: 16000, presion_bar: 8, potencia_hp: 120, potencia_kw: 90,  tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD110-VFD", marca: "UNITED", caudal_cfm: 706.0,  caudal_lmin: 20000, presion_bar: 8, potencia_hp: 150, potencia_kw: 110, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD132-VFD", marca: "UNITED", caudal_cfm: 812.0,  caudal_lmin: 23000, presion_bar: 8, potencia_hp: 175, potencia_kw: 132, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD160-VFD", marca: "UNITED", caudal_cfm: 953.0,  caudal_lmin: 27000, presion_bar: 8, potencia_hp: 220, potencia_kw: 160, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD185-VFD", marca: "UNITED", caudal_cfm: 1041.0, caudal_lmin: 29500, presion_bar: 8, potencia_hp: 250, potencia_kw: 185, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD200-VFD", marca: "UNITED", caudal_cfm: 1377.0, caudal_lmin: 39000, presion_bar: 8, potencia_hp: 270, potencia_kw: 200, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD250-VFD", marca: "UNITED", caudal_cfm: 1649.0, caudal_lmin: 46700, presion_bar: 8, potencia_hp: 340, potencia_kw: 250, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD280-VFD", marca: "UNITED", caudal_cfm: 1836.0, caudal_lmin: 52000, presion_bar: 8, potencia_hp: 380, potencia_kw: 280, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD315-VFD", marca: "UNITED", caudal_cfm: 2002.0, caudal_lmin: 56700, presion_bar: 8, potencia_hp: 430, potencia_kw: 315, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  { modelo: "UD355-VFD", marca: "UNITED", caudal_cfm: 2313.0, caudal_lmin: 65500, presion_bar: 8, potencia_hp: 480, potencia_kw: 355, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1 },
  // --- UDT dos etapas, alta eficiencia (a 8 bar) ---
  { modelo: "UDT55-VPM",  marca: "UNITED", caudal_cfm: 388.5,  caudal_lmin: 11000, presion_bar: 8, potencia_hp: 75,  potencia_kw: 55,  tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas: máxima eficiencia energética para operación continua." },
  { modelo: "UDT75-VPM",  marca: "UNITED", caudal_cfm: 536.8,  caudal_lmin: 15200, presion_bar: 8, potencia_hp: 100, potencia_kw: 75,  tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas: máxima eficiencia energética." },
  { modelo: "UDT90-VPM",  marca: "UNITED", caudal_cfm: 688.6,  caudal_lmin: 19500, presion_bar: 8, potencia_hp: 120, potencia_kw: 90,  tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas: máxima eficiencia energética." },
  { modelo: "UDT110-VPM", marca: "UNITED", caudal_cfm: 826.4,  caudal_lmin: 23400, presion_bar: 8, potencia_hp: 150, potencia_kw: 110, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas: máxima eficiencia energética." },
  { modelo: "UDT132-VPM", marca: "UNITED", caudal_cfm: 953.5,  caudal_lmin: 27000, presion_bar: 8, potencia_hp: 175, potencia_kw: 132, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas." },
  { modelo: "UDT160-VPM", marca: "UNITED", caudal_cfm: 1165.4, caudal_lmin: 33000, presion_bar: 8, potencia_hp: 220, potencia_kw: 160, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas." },
  { modelo: "UDT185-VPM", marca: "UNITED", caudal_cfm: 1341.9, caudal_lmin: 38000, presion_bar: 8, potencia_hp: 250, potencia_kw: 185, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas." },
  { modelo: "UDT200-VPM", marca: "UNITED", caudal_cfm: 1447.9, caudal_lmin: 41000, presion_bar: 8, potencia_hp: 270, potencia_kw: 200, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas." },
  { modelo: "UDT220-VPM", marca: "UNITED", caudal_cfm: 1624.5, caudal_lmin: 46000, presion_bar: 8, potencia_hp: 300, potencia_kw: 220, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas." },
  { modelo: "UDT250-VPM", marca: "UNITED", caudal_cfm: 1765.7, caudal_lmin: 50000, presion_bar: 8, potencia_hp: 340, potencia_kw: 250, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas." },
  { modelo: "UDT280-VPM", marca: "UNITED", caudal_cfm: 1977.6, caudal_lmin: 56000, presion_bar: 8, potencia_hp: 380, potencia_kw: 280, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas." },
  { modelo: "UDT315-VPM", marca: "UNITED", caudal_cfm: 2153.9, caudal_lmin: 61000, presion_bar: 8, potencia_hp: 430, potencia_kw: 315, tipo: "tornillo_2etapas", oil_free: false, segmento: "premium_industrial", etapas: 2, nota: "Dos etapas, gran caudal." },
  // --- UNITED Oil-Free de tornillo (dos etapas, Clase 0) a 8.6 bar ---
  { modelo: "UDL-37A (Oil-Free)",  marca: "UNITED", caudal_cfm: 187.2, caudal_lmin: 5300,  presion_bar: 8.6, potencia_hp: 50,  potencia_kw: 37,  tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0 (ISO 8573-1). Para procesos críticos de gran caudal: farma, alimentos, electrónica." },
  { modelo: "UDL-45A (Oil-Free)",  marca: "UNITED", caudal_cfm: 222.5, caudal_lmin: 6300,  presion_bar: 8.6, potencia_hp: 60,  potencia_kw: 45,  tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0. Gran caudal oil-free." },
  { modelo: "UDL-55A (Oil-Free)",  marca: "UNITED", caudal_cfm: 289.6, caudal_lmin: 8200,  presion_bar: 8.6, potencia_hp: 75,  potencia_kw: 55,  tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0." },
  { modelo: "UDL-75A (Oil-Free)",  marca: "UNITED", caudal_cfm: 356.7, caudal_lmin: 10100, presion_bar: 8.6, potencia_hp: 100, potencia_kw: 75,  tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0." },
  { modelo: "UDL-90A (Oil-Free)",  marca: "UNITED", caudal_cfm: 529.7, caudal_lmin: 15000, presion_bar: 8.6, potencia_hp: 120, potencia_kw: 90,  tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0." },
  { modelo: "UDL-110A (Oil-Free)", marca: "UNITED", caudal_cfm: 653.3, caudal_lmin: 18500, presion_bar: 8.6, potencia_hp: 150, potencia_kw: 110, tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0, gran caudal." },
  { modelo: "UDL-132A (Oil-Free)", marca: "UNITED", caudal_cfm: 755.7, caudal_lmin: 21400, presion_bar: 8.6, potencia_hp: 175, potencia_kw: 132, tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0, gran caudal." },
  { modelo: "UDL-160A (Oil-Free)", marca: "UNITED", caudal_cfm: 932.3, caudal_lmin: 26400, presion_bar: 8.6, potencia_hp: 220, potencia_kw: 160, tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0, gran caudal." },
  { modelo: "UDL-200A (Oil-Free)", marca: "UNITED", caudal_cfm: 1211.3, caudal_lmin: 34300, presion_bar: 8.6, potencia_hp: 270, potencia_kw: 200, tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0, gran caudal." },
  { modelo: "UDL-250A (Oil-Free)", marca: "UNITED", caudal_cfm: 1458.5, caudal_lmin: 41300, presion_bar: 8.6, potencia_hp: 340, potencia_kw: 250, tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0, gran caudal." },
  { modelo: "UDL-315A (Oil-Free)", marca: "UNITED", caudal_cfm: 1801.0, caudal_lmin: 51000, presion_bar: 8.6, potencia_hp: 430, potencia_kw: 315, tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0, gran caudal." },
  { modelo: "UDL-355A (Oil-Free)", marca: "UNITED", caudal_cfm: 2094.2, caudal_lmin: 59300, presion_bar: 8.6, potencia_hp: 480, potencia_kw: 355, tipo: "tornillo_2etapas", oil_free: true, segmento: "oil_free_critico", etapas: 2, nota: "Tornillo SIN ACEITE Clase 0, gran caudal." },
  // --- UNITED BAJA PRESIÓN (3-5 bar): transporte neumático, telares, sopladores de proceso ---
  { modelo: "UD75A-3VPM (baja presión)",  marca: "UNITED", caudal_cfm: 759.3,  caudal_lmin: 21500, presion_bar: 3, potencia_hp: 100, potencia_kw: 75,  tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "BAJA PRESIÓN (3 bar). Para transporte neumático, telares air-jet, procesos de soplado de baja presión." },
  { modelo: "UD110A-3VPM (baja presión)", marca: "UNITED", caudal_cfm: 1130.1, caudal_lmin: 32000, presion_bar: 3, potencia_hp: 150, potencia_kw: 110, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "BAJA PRESIÓN (3 bar). Transporte neumático, procesos de baja presión." },
  { modelo: "UD160A-3VPM (baja presión)", marca: "UNITED", caudal_cfm: 1659.8, caudal_lmin: 47000, presion_bar: 3, potencia_hp: 220, potencia_kw: 160, tipo: "tornillo", oil_free: false, segmento: "premium_industrial", etapas: 1, nota: "BAJA PRESIÓN (3 bar). Transporte neumático, gran caudal de baja presión." },

  // ==========================================================
  // MAXTOP — PENDIENTE: catálogo aún no cargado.
  // Cuando Julio suba la ficha técnica MAXTOP, agregar aquí los
  // modelos reales (oil-free para dental/farma/alimentos/lab).
  // NO inventar modelos: para necesidades oil-free, el recomendador
  // usa por ahora la línea UNITED UDL (tornillo oil-free Clase 0).
  // ==========================================================
];

// ============================================================
// ACCESORIOS — secadores y estanques (para complementar la propuesta)
// ============================================================
export const ACCESORIOS = [
  // Secadores refrigerativos KRATTO (caudal de secado en CFM)
  { modelo: "K-DRY 1.5",  marca: "KRATTO", tipo: "secador", caudal_cfm: 53,  presion_bar: 13, potencia_kw: 0.6, nota: "Secador refrigerativo hasta 53 CFM." },
  { modelo: "K-DRY 2.5",  marca: "KRATTO", tipo: "secador", caudal_cfm: 88,  presion_bar: 13, potencia_kw: 0.75, nota: "Secador refrigerativo hasta 88 CFM." },
  { modelo: "K-DRY 3.5",  marca: "KRATTO", tipo: "secador", caudal_cfm: 124, presion_bar: 13, potencia_kw: 1.0, nota: "Secador refrigerativo hasta 124 CFM." },
  { modelo: "K-DRY 6.5",  marca: "KRATTO", tipo: "secador", caudal_cfm: 230, presion_bar: 13, potencia_kw: 1.5, nota: "Secador refrigerativo hasta 230 CFM." },
  { modelo: "K-DRY 8.5",  marca: "KRATTO", tipo: "secador", caudal_cfm: 300, presion_bar: 13, potencia_kw: 2.8, nota: "Secador refrigerativo hasta 300 CFM." },
  { modelo: "K-DRY 10.5", marca: "KRATTO", tipo: "secador", caudal_cfm: 371, presion_bar: 13, potencia_kw: 2.8, nota: "Secador refrigerativo hasta 371 CFM." },
  // Estanques acumuladores KRATTO
  { modelo: "TNK-600",  marca: "KRATTO", tipo: "estanque", capacidad_l: 600,  presion_bar: 13, nota: "Estanque acumulador 600 L." },
  { modelo: "TNK-1000", marca: "KRATTO", tipo: "estanque", capacidad_l: 1000, presion_bar: 13, nota: "Estanque acumulador 1000 L (1 m³)." },
  { modelo: "TNK-3000", marca: "KRATTO", tipo: "estanque", capacidad_l: 3000, presion_bar: 13, nota: "Estanque acumulador 3000 L (3 m³)." },
];

// ============================================================
// RECOMENDADOR DE MODELO
// Cruza el CFM proyectado (de calcular_consumo) con el catálogo
// real y devuelve el/los modelos que cubren la demanda con un
// margen de holgura adecuado.
// ============================================================
const MARGEN_MIN = 1.0;    // el compresor debe cubrir al menos el 100% del CFM proyectado
const MARGEN_IDEAL = 1.20; // holgura ideal ~20% sobre el proyectado (margen sano de ingeniería)
const MARGEN_MAX_RAZONABLE = 1.8; // más allá de esto está sobredimensionado (costo innecesario)

export function recomendarModelo({
  cfm_requerido,
  presion_requerida_bar = 8,
  oil_free = false,
  segmento_preferido,        // 'pyme' | 'premium_industrial' (opcional)
}) {
  if (!cfm_requerido || cfm_requerido <= 0) {
    return { error: "Se requiere el CFM proyectado para recomendar un modelo. Primero calcula el consumo." };
  }

  // 1) Filtrar candidatos que cumplen caudal, presión y oil-free
  let candidatos = COMPRESORES.filter((c) => {
    if (oil_free && !c.oil_free) return false;                 // si necesita oil-free, solo oil-free
    if (c.caudal_cfm < cfm_requerido * MARGEN_MIN) return false; // debe cubrir el caudal
    if (c.presion_bar < presion_requerida_bar - 0.3) return false; // debe alcanzar la presión (tolerancia 0.3)
    return true;
  });

  if (!candidatos.length) {
    // No hay un solo equipo que cubra: sugerir el mayor disponible + nota de sistema múltiple
    const universo = COMPRESORES.filter((c) => (!oil_free || c.oil_free) && c.presion_bar >= presion_requerida_bar - 0.3);
    const mayor = universo.sort((a, b) => b.caudal_cfm - a.caudal_cfm)[0];
    return {
      sin_equipo_unico: true,
      cfm_requerido,
      mensaje: mayor
        ? `La demanda (${round(cfm_requerido)} CFM) supera el mayor equipo individual disponible (${mayor.modelo}, ${mayor.caudal_cfm} CFM). Se recomienda un sistema de múltiples compresores en paralelo o una evaluación de ingeniería IMACOMP.`
        : `No hay un modelo en catálogo que cumpla simultáneamente el caudal y la presión requerida. Se recomienda evaluación de ingeniería IMACOMP.`,
      mayor_disponible: mayor ? resumirModelo(mayor) : null,
    };
  }

  // 2) Ordenar: preferir el modelo con holgura suficiente (>=8%) más ajustado.
  //    Un compresor justo al límite (0-8%) trabaja saturado; uno con 8-50% es sano;
  //    más de 80% es sobredimensionar (costo y energía innecesarios).
  candidatos.sort((a, b) => puntajeAjuste(a, cfm_requerido) - puntajeAjuste(b, cfm_requerido));

  // 3) Recomendación principal + alternativas de otras marcas/segmentos
  const principal = candidatos[0];

  // 3b) Control de sobredimensión EXTREMA: si hasta el equipo más ajustado
  // triplica la demanda, no hay equipo bien dimensionado en catálogo para
  // este caudal. Frecuente en oil-free de muy bajo consumo (dental, lab):
  // el UDL más chico es industrial. Derivar a ventas en vez de proponer
  // un equipo absurdamente grande.
  const ratioPrincipal = principal.caudal_cfm / cfm_requerido;
  if (ratioPrincipal > 3) {
    return {
      sin_equipo_ajustado: true,
      cfm_requerido: round(cfm_requerido),
      presion_requerida_bar,
      oil_free,
      mensaje:
        `La demanda (${round(cfm_requerido)} CFM) es menor que el equipo más pequeño disponible en catálogo para este tipo ` +
        `(${principal.modelo}, ${principal.caudal_cfm} CFM). ` +
        (oil_free
          ? "Para aplicaciones oil-free de bajo consumo (dental, laboratorio, farma pequeña), IMACOMP cuenta con la línea MAXTOP de pistón sin aceite, ideal para estos caudales. Un asesor te confirmará el modelo MAXTOP exacto."
          : "Un asesor IMACOMP te recomendará la opción mejor dimensionada para evitar sobredimensionar el equipo."),
      referencia_mayor_que_demanda: resumirModelo(principal),
    };
  }

  // Alternativa premium (UNITED) si la principal es KRATTO, y viceversa
  const alternativas = [];
  const marcasVistas = new Set([principal.marca]);
  for (const c of candidatos) {
    if (alternativas.length >= 2) break;
    if (!marcasVistas.has(c.marca)) {
      alternativas.push(c);
      marcasVistas.add(c.marca);
    }
  }

  // Secador y estanque sugeridos según el CFM
  const secador = ACCESORIOS
    .filter((a) => a.tipo === "secador" && a.caudal_cfm >= cfm_requerido)
    .sort((a, b) => a.caudal_cfm - b.caudal_cfm)[0];

  return {
    cfm_requerido: round(cfm_requerido),
    presion_requerida_bar,
    oil_free,
    recomendacion_principal: resumirModelo(principal),
    margen_holgura: `${Math.round((principal.caudal_cfm / cfm_requerido - 1) * 100)}%`,
    alternativas: alternativas.map(resumirModelo),
    secador_sugerido: secador ? { modelo: secador.modelo, marca: secador.marca, caudal_cfm: secador.caudal_cfm } : null,
    nota_tecnica:
      "Caudales y presiones son de referencia de catálogo. La selección final debe validarla un ingeniero IMACOMP " +
      "considerando altitud, temperatura, calidad de aire requerida y perfil de demanda real. " +
      (oil_free ? "Aplicación oil-free: equipos Clase 0 (ISO 8573-1) para no contaminar el proceso." : ""),
  };
}

function puntajeAjuste(c, cfm) {
  const ratio = c.caudal_cfm / cfm;
  // Penaliza estar muy al límite (saturado) y estar muy sobredimensionado.
  // Zona sana 1.08–1.50: el más ajustado dentro de esa zona gana.
  if (ratio < 1.08) return 100 + (1.08 - ratio) * 50;       // casi saturado: penalización alta
  if (ratio <= 1.50) return ratio - 1.08;                    // zona ideal: menor holgura sobrante = mejor
  if (ratio <= MARGEN_MAX_RAZONABLE) return 1 + (ratio - 1.5); // aceptable pero holgado
  return 50 + ratio;                                          // sobredimensionado: evitar
}

function resumirModelo(c) {
  return {
    modelo: c.modelo,
    marca: c.marca,
    caudal_cfm: c.caudal_cfm,
    caudal_lmin: c.caudal_lmin,
    presion_bar: c.presion_bar,
    potencia_hp: c.potencia_hp,
    potencia_kw: c.potencia_kw,
    tipo: c.tipo,
    oil_free: c.oil_free,
    nota: c.nota || null,
  };
}

export function buscarCompresor(texto) {
  const t = normalizar(texto);
  return COMPRESORES
    .filter((c) => normalizar(c.modelo).includes(t) || normalizar(c.marca).includes(t))
    .map(resumirModelo);
}

export function listarPorMarca(marca) {
  const m = normalizar(marca);
  return COMPRESORES.filter((c) => normalizar(c.marca).includes(m)).map(resumirModelo);
}

function normalizar(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function round(n, dec = 1) {
  const f = Math.pow(10, dec);
  return Math.round(n * f) / f;
}
