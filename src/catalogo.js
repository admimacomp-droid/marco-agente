/**
 * catalogo.js — Catálogo técnico IMACOMP para el agente Marco
 * ----------------------------------------------------------------
 * Datos cargados directamente en código (sin RAG).
 * Caudal United/UDL referenciado a 8 bar (0,8 MPa) como estándar industrial.
 * Conversión usada: 1 m³/min = 35,31 CFM.
 *
 * Segmentación (según necesidad del cliente):
 *   - KRATTO        : lubricado, PYME/taller        | 3–50 HP   (catálogo llega a 100 HP)
 *   - UNITED_OSD    : lubricado, industrial premium  | 37–560 kW
 *   - MAXTOP        : libre de aceite (pistón) Clase0 | 5–32 HP
 *   - UNITED_UDL    : libre de aceite (tornillo) Clase0| 37–355 kW
 *
 * Cada equipo expone campos normalizados para búsqueda:
 *   marca, modelo, tipo, libre_aceite (bool),
 *   potencia_hp, potencia_kw,
 *   caudal_cfm, caudal_lmin (o m3min),
 *   presion_bar_max, salida, extra
 * ----------------------------------------------------------------
 */

const CATALOGO = {

  // ===========================================================
  // SEGMENTO 1 — KRATTO (3–50 HP) · Lubricado · PYME/taller
  // ===========================================================
  KRATTO: {
    descripcion: "Compresores lubricados para PYME, talleres e industria liviana. Aire estándar.",
    rango: "3 HP a 50 HP (modelos KRX 60 y KRX 100 disponibles bajo asesoría)",
    equipos: [
      // Pistón KPX (mismo cabezal, distinto estanque)
      { modelo: "KPX 3/100", tipo: "piston",  libre_aceite: false, potencia_hp: 3,  potencia_kw: 2.2,  caudal_cfm: 15,    caudal_lmin: 418,   presion_bar_max: 10, estanque_l: 100, peso_kg: 72  },
      { modelo: "KPX 3/200", tipo: "piston",  libre_aceite: false, potencia_hp: 3,  potencia_kw: 2.2,  caudal_cfm: 15,    caudal_lmin: 418,   presion_bar_max: 10, estanque_l: 200, peso_kg: 110 },
      { modelo: "KPX 3/270", tipo: "piston",  libre_aceite: false, potencia_hp: 3,  potencia_kw: 2.2,  caudal_cfm: 15,    caudal_lmin: 418,   presion_bar_max: 10, estanque_l: 270, peso_kg: 146 },
      // Tornillo con secador integrado KRXD (4 en 1)
      { modelo: "KRXD 10/500", tipo: "tornillo_integrado", libre_aceite: false, potencia_hp: 10, potencia_kw: 7.5, caudal_cfm: 31.8,  caudal_lmin: 900,  presion_bar_max: 10, estanque_l: 500, salida: '3/4"', peso_kg: 400 },
      { modelo: "KRXD 15/500", tipo: "tornillo_integrado", libre_aceite: false, potencia_hp: 15, potencia_kw: 11,  caudal_cfm: 45.9,  caudal_lmin: 1300, presion_bar_max: 10, estanque_l: 500, salida: '1"',   peso_kg: 450 },
      { modelo: "KRXD 20/500", tipo: "tornillo_integrado", libre_aceite: false, potencia_hp: 20, potencia_kw: 15,  caudal_cfm: 74.15, caudal_lmin: 2100, presion_bar_max: 10, estanque_l: 500, salida: '1"',   peso_kg: 450 },
      // Tornillo KRX (sin estanque)
      { modelo: "KRX 10",  tipo: "tornillo", libre_aceite: false, potencia_hp: 10,  potencia_kw: 7.5, caudal_cfm: 31.8,  caudal_lmin: 900,   presion_bar_max: 10, salida: '3/4"', peso_kg: 250 },
      { modelo: "KRX 15",  tipo: "tornillo", libre_aceite: false, potencia_hp: 15,  potencia_kw: 11,  caudal_cfm: 45.9,  caudal_lmin: 1300,  presion_bar_max: 10, salida: '1"',   peso_kg: 400 },
      { modelo: "KRX 20",  tipo: "tornillo", libre_aceite: false, potencia_hp: 20,  potencia_kw: 15,  caudal_cfm: 74.15, caudal_lmin: 2100,  presion_bar_max: 10, salida: '1"',   peso_kg: 400 },
      { modelo: "KRX 30",  tipo: "tornillo", libre_aceite: false, potencia_hp: 30,  potencia_kw: 22,  caudal_cfm: 123,   caudal_lmin: 3200,  presion_bar_max: 10, salida: '1"',   peso_kg: 550 },
      { modelo: "KRX 50",  tipo: "tornillo", libre_aceite: false, potencia_hp: 50,  potencia_kw: 37,  caudal_cfm: 197.7, caudal_lmin: 5600,  presion_bar_max: 10, salida: '2"',   peso_kg: 750 },
      // Sobre el tope de 50 HP — recomendar bajo asesoría
      { modelo: "KRX 60",  tipo: "tornillo", libre_aceite: false, potencia_hp: 60,  potencia_kw: 45,  caudal_cfm: 219,   caudal_lmin: 6200,  presion_bar_max: 10, salida: '2"',   peso_kg: 800,  sobre_rango: true },
      { modelo: "KRX 100", tipo: "tornillo", libre_aceite: false, potencia_hp: 100, potencia_kw: 75,  caudal_cfm: 395.5, caudal_lmin: 11200, presion_bar_max: 10, salida: '2"',   peso_kg: 1850, sobre_rango: true },
    ],
    // Complementos (secadores y estanques) — para dimensionamiento del ingeniero
    secadores: [
      { modelo: "K-DRY 1.5",  caudal_cfm: 53,  caudal_lmin: 1500,  potencia_kw: 0.6,  salida: '1½"' },
      { modelo: "K-DRY 2.5",  caudal_cfm: 88,  caudal_lmin: 2500,  potencia_kw: 0.75, salida: '1¾"' },
      { modelo: "K-DRY 3.5",  caudal_cfm: 124, caudal_lmin: 3500,  potencia_kw: 1,    salida: '1¾"' },
      { modelo: "K-DRY 6.5",  caudal_cfm: 230, caudal_lmin: 6500,  potencia_kw: 1.5,  salida: '2"'  },
      { modelo: "K-DRY 8.5",  caudal_cfm: 300, caudal_lmin: 8500,  potencia_kw: 2.8,  salida: '2"'  },
      { modelo: "K-DRY 10.5", caudal_cfm: 371, caudal_lmin: 10500, potencia_kw: 2.8,  salida: '2"'  },
    ],
    estanques: [
      { modelo: "TNK-600",  capacidad_l: 600,  salida: '1½"' },
      { modelo: "TNK-1000", capacidad_l: 1000, salida: '2"'  },
      { modelo: "TNK-3000", capacidad_l: 3000, salida: '2"'  },
    ],
  },

  // ===========================================================
  // SEGMENTO 2 — UNITED OSD (37–560 kW) · Lubricado · Industrial premium
  // Caudal a 8 bar (0,8 MPa). Una etapa (UD) y dos etapas (UDT).
  // ===========================================================
  UNITED_OSD: {
    descripcion: "Compresores de tornillo lubricados, industrial premium (joint venture Hitachi). Una y dos etapas.",
    rango: "37 kW a 560 kW",
    equipos: [
      // --- UNA ETAPA (UD / UD-VPM) a 8 bar ---
      { modelo: "UD37A-VPM",  tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 37,  caudal_m3min: 6.70,  caudal_cfm: 236.6,  presion_bar_max: 10, salida: "G1½",  presiones_bar: [7,8,10] },
      { modelo: "UD45A-VPM",  tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 45,  caudal_m3min: 8.10,  caudal_cfm: 286.0,  presion_bar_max: 10, salida: "G2",   presiones_bar: [7,8,10] },
      { modelo: "UD55A-VPM",  tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 55,  caudal_m3min: 10.50, caudal_cfm: 370.7,  presion_bar_max: 10, salida: "G2",   presiones_bar: [7,8,10] },
      { modelo: "UD75",       tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 75,  caudal_m3min: 11.60, caudal_cfm: 409.6,  presion_bar_max: 10, salida: "DN50", presiones_bar: [7,8,10] },
      { modelo: "UD90",       tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 90,  caudal_m3min: 16.00, caudal_cfm: 564.9,  presion_bar_max: 10, salida: "DN50", presiones_bar: [7,8,10] },
      { modelo: "UD110",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 110, caudal_m3min: 20.00, caudal_cfm: 706.2,  presion_bar_max: 10, salida: "DN80", presiones_bar: [7,8,10] },
      { modelo: "UD132",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 132, caudal_m3min: 23.00, caudal_cfm: 812.1,  presion_bar_max: 10, salida: "DN80", presiones_bar: [7,8,10] },
      { modelo: "UD160",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 160, caudal_m3min: 27.00, caudal_cfm: 953.3,  presion_bar_max: 10, salida: "DN80", presiones_bar: [7,8,10] },
      { modelo: "UD185",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 185, caudal_m3min: 29.50, caudal_cfm: 1041.6, presion_bar_max: 10, salida: "DN80", presiones_bar: [7,8,10] },
      { modelo: "UD200",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 200, caudal_m3min: 39.00, caudal_cfm: 1377.1, presion_bar_max: 10, salida: "DN100",presiones_bar: [7,8,10] },
      { modelo: "UD250",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 250, caudal_m3min: 46.70, caudal_cfm: 1649.0, presion_bar_max: 10, salida: "DN125",presiones_bar: [7,8,10] },
      { modelo: "UD280",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 280, caudal_m3min: 52.00, caudal_cfm: 1836.1, presion_bar_max: 10, salida: "DN125",presiones_bar: [7,8,10] },
      { modelo: "UD315",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 315, caudal_m3min: 56.70, caudal_cfm: 2002.1, presion_bar_max: 10, salida: "DN125",presiones_bar: [7,8,10] },
      { modelo: "UD355",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 355, caudal_m3min: 65.50, caudal_cfm: 2312.8, presion_bar_max: 10, salida: "DN125",presiones_bar: [7,8,10] },
      { modelo: "UD400",      tipo: "tornillo_1etapa", libre_aceite: false, potencia_kw: 400, caudal_m3min: 72.30, caudal_cfm: 2552.9, presion_bar_max: 10, salida: "DN125",presiones_bar: [8,10] },
      // --- DOS ETAPAS (UDT / UDT-VPM) a 8 bar — mayor eficiencia energética ---
      { modelo: "UDT55",  tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 55,  caudal_m3min: 11.0,  caudal_cfm: 388.4,  presion_bar_max: 8,    salida: "DN80",  presiones_bar: [7,8],         dos_etapas: true },
      { modelo: "UDT75",  tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 75,  caudal_m3min: 15.2,  caudal_cfm: 536.7,  presion_bar_max: 12.5, salida: "DN80",  presiones_bar: [7,8,10,12.5], dos_etapas: true },
      { modelo: "UDT90",  tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 90,  caudal_m3min: 19.5,  caudal_cfm: 688.5,  presion_bar_max: 12.5, salida: "DN80",  presiones_bar: [7,8,10,12.5], dos_etapas: true },
      { modelo: "UDT110", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 110, caudal_m3min: 23.4,  caudal_cfm: 826.3,  presion_bar_max: 12.5, salida: "DN80",  presiones_bar: [7,8,10,12.5], dos_etapas: true },
      { modelo: "UDT132", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 132, caudal_m3min: 27.0,  caudal_cfm: 953.3,  presion_bar_max: 10,   salida: "DN80",  presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT160", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 160, caudal_m3min: 33.0,  caudal_cfm: 1165.2, presion_bar_max: 10,   salida: "DN80",  presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT185", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 185, caudal_m3min: 38.0,  caudal_cfm: 1341.8, presion_bar_max: 10,   salida: "DN100", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT200", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 200, caudal_m3min: 41.0,  caudal_cfm: 1447.7, presion_bar_max: 8,    salida: "DN125", presiones_bar: [7,8],         dos_etapas: true },
      { modelo: "UDT220", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 220, caudal_m3min: 46.0,  caudal_cfm: 1624.3, presion_bar_max: 10,   salida: "DN125", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT250", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 250, caudal_m3min: 50.0,  caudal_cfm: 1765.5, presion_bar_max: 10,   salida: "DN125", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT280", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 280, caudal_m3min: 56.0,  caudal_cfm: 1977.4, presion_bar_max: 10,   salida: "DN125", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT315", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 315, caudal_m3min: 61.0,  caudal_cfm: 2153.9, presion_bar_max: 10,   salida: "DN125", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT355", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 355, caudal_m3min: 69.5,  caudal_cfm: 2454.0, presion_bar_max: 10,   salida: "DN150", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT400", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 400, caudal_m3min: 76.5,  caudal_cfm: 2701.2, presion_bar_max: 10,   salida: "DN150", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT450", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 450, caudal_m3min: 84.0,  caudal_cfm: 2966.0, presion_bar_max: 10,   salida: "DN150", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT500", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 500, caudal_m3min: 93.0,  caudal_cfm: 3283.8, presion_bar_max: 10,   salida: "DN150", presiones_bar: [7,8,10],      dos_etapas: true },
      { modelo: "UDT560", tipo: "tornillo_2etapas", libre_aceite: false, potencia_kw: 560, caudal_m3min: 103.0, caudal_cfm: 3636.9, presion_bar_max: 10,   salida: "DN150", presiones_bar: [10],          dos_etapas: true },
    ],
  },

  // ===========================================================
  // SEGMENTO 3 — MAXTOP (5–32 HP) · Pistón libre de aceite Clase 0
  // ===========================================================
  MAXTOP: {
    descripcion: "Compresores de pistón LIBRE DE ACEITE (ISO 8573-1 Clase 0). Farma, alimentos, dental, laboratorio. Modular por cabezales de 5 HP.",
    rango: "5 HP a 32 HP",
    equipos: [
      { modelo: "MT-OP3",  tipo: "piston", libre_aceite: true, potencia_hp: 5,  potencia_kw: 4,  caudal_m3min: 0.3, caudal_cfm: 10.6, presion_bar_max: 10, ruido_db: 60, salida: '1/2"', config: "1 cabezal",  peso_kg: 82  },
      { modelo: "MT-OP3S", tipo: "piston", libre_aceite: true, potencia_hp: 5,  potencia_kw: 4,  caudal_m3min: 0.3, caudal_cfm: 10.6, presion_bar_max: 10, ruido_db: 62, salida: '3/4"', config: "1 cabezal c/estanque", peso_kg: 125 },
      { modelo: "MT-OP6",  tipo: "piston", libre_aceite: true, potencia_hp: 10, potencia_kw: 8,  caudal_m3min: 0.6, caudal_cfm: 21.2, presion_bar_max: 10, ruido_db: 62, salida: '3/4"', config: "2 cabezales", peso_kg: 165 },
      { modelo: "MT-OP9",  tipo: "piston", libre_aceite: true, potencia_hp: 16, potencia_kw: 12, caudal_m3min: 0.9, caudal_cfm: 31.8, presion_bar_max: 10, ruido_db: 63, salida: "G1",   config: "3 cabezales", peso_kg: 260 },
      { modelo: "MT-OP12", tipo: "piston", libre_aceite: true, potencia_hp: 21, potencia_kw: 16, caudal_m3min: 1.2, caudal_cfm: 42.4, presion_bar_max: 10, ruido_db: 65, salida: "G1",   config: "4 cabezales", peso_kg: 300 },
      { modelo: "MT-OP18", tipo: "piston", libre_aceite: true, potencia_hp: 32, potencia_kw: 24, caudal_m3min: 1.8, caudal_cfm: 63.6, presion_bar_max: 10, ruido_db: 68, salida: "G1",   config: "6 cabezales", peso_kg: 450 },
    ],
  },

  // ===========================================================
  // SEGMENTO 4 — UNITED UDL (37–355 kW) · Tornillo libre de aceite Clase 0
  // Caudal a 7,5 bar (dato más completo del catálogo oil-free).
  // ===========================================================
  UNITED_UDL: {
    descripcion: "Compresores de tornillo LIBRE DE ACEITE (TUV Clase 0). Dos etapas. Farma, electrónica, nueva energía de gran caudal.",
    rango: "37 kW a 355 kW",
    nota_presion: "Caudal referenciado a 7,5 bar (dato base del catálogo oil-free).",
    equipos: [
      { modelo: "UDL-37A",   tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 37,  caudal_m3min: 5.5,  caudal_cfm: 194.2,  presion_bar_max: 8.6, refrig: "aire",       salida: "DN40" },
      { modelo: "UDL-45A",   tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 45,  caudal_m3min: 6.5,  caudal_cfm: 229.5,  presion_bar_max: 10,  refrig: "aire",       salida: "DN40" },
      { modelo: "UDL-55A",   tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 55,  caudal_m3min: 8.4,  caudal_cfm: 296.6,  presion_bar_max: 10,  refrig: "aire",       salida: "DN40" },
      { modelo: "UDL-55A/W", tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 55,  caudal_m3min: 9.4,  caudal_cfm: 331.9,  presion_bar_max: 8.6, refrig: "aire/agua",  salida: "DN65" },
      { modelo: "UDL-75A/W", tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 75,  caudal_m3min: 12.5, caudal_cfm: 441.4,  presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN65" },
      { modelo: "UDL-90A/W", tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 90,  caudal_m3min: 15.3, caudal_cfm: 540.2,  presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN65" },
      { modelo: "UDL-110A/W",tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 110, caudal_m3min: 18.7, caudal_cfm: 660.3,  presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN80" },
      { modelo: "UDL-132A/W",tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 132, caudal_m3min: 23.7, caudal_cfm: 836.8,  presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN80" },
      { modelo: "UDL-160A/W",tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 160, caudal_m3min: 26.7, caudal_cfm: 942.8,  presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN80" },
      { modelo: "UDL-200A/W",tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 200, caudal_m3min: 34.6, caudal_cfm: 1221.7, presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN80" },
      { modelo: "UDL-250A/W",tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 250, caudal_m3min: 45.0, caudal_cfm: 1589.0, presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN80" },
      { modelo: "UDL-315A/W",tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 315, caudal_m3min: 54.1, caudal_cfm: 1910.3, presion_bar_max: 10,  refrig: "aire/agua",  salida: "DN100" },
      { modelo: "UDL-355W",  tipo: "tornillo_oilfree", libre_aceite: true, potencia_kw: 355, caudal_m3min: 65.2, caudal_cfm: 2302.2, presion_bar_max: 10,  refrig: "agua",       salida: "DN100" },
    ],
  },
};

// ===========================================================
// FUNCIONES DE BÚSQUEDA PARA MARCO
// ===========================================================

/** Devuelve todos los compresores (excluye secadores/estanques) de todas las marcas en una lista plana. */
function todosLosCompresores() {
  const lista = [];
  for (const marca of Object.keys(CATALOGO)) {
    for (const eq of CATALOGO[marca].equipos) {
      lista.push({ ...eq, marca });
    }
  }
  return lista;
}

/**
 * Recomienda equipos por CFM requerido.
 * @param {number} cfmRequerido  - caudal que necesita el cliente
 * @param {object} opts          - { libreAceite: bool|null, margen: 0.15 }
 * Aplica un margen de seguridad (por defecto 15%) sobre el CFM requerido.
 * Devuelve, por cada marca aplicable, el primer equipo que cubre el caudal.
 */
function recomendarPorCFM(cfmRequerido, opts = {}) {
  const margen = opts.margen ?? 0.15;
  const objetivo = cfmRequerido * (1 + margen);
  const libreAceite = opts.libreAceite ?? null;

  const candidatos = todosLosCompresores()
    .filter(eq => !eq.sobre_rango)                                  // omitir equipos fuera de rango de segmentación
    .filter(eq => libreAceite === null || eq.libre_aceite === libreAceite)
    .filter(eq => eq.caudal_cfm >= objetivo)
    .sort((a, b) => a.caudal_cfm - b.caudal_cfm);

  // Mejor opción por marca (el más ajustado que cubre el caudal)
  const porMarca = {};
  for (const eq of candidatos) {
    if (!porMarca[eq.marca]) porMarca[eq.marca] = eq;
  }
  return { objetivo_cfm: Math.round(objetivo), recomendaciones: porMarca };
}

/**
 * Selecciona la marca correcta según necesidad de aire y tamaño.
 * @param {boolean} libreAceite - ¿requiere aire libre de aceite (farma/alimentos/dental)?
 * @param {number}  cfm         - caudal requerido
 * Regla de corte oil-free: Maxtop hasta ~64 CFM (32 HP); sobre eso, UNITED UDL.
 */
function elegirMarca(libreAceite, cfm) {
  if (libreAceite) {
    return cfm <= 64 ? "MAXTOP" : "UNITED_UDL";
  }
  // Lubricado: KRATTO cubre hasta ~198 CFM (50 HP); sobre eso, UNITED OSD.
  return cfm <= 198 ? "KRATTO" : "UNITED_OSD";
}

/** Busca un equipo por nombre de modelo (búsqueda flexible, sin distinguir mayúsculas/espacios). */
function buscarModelo(texto) {
  const norm = s => s.toLowerCase().replace(/\s+/g, "");
  const q = norm(texto);
  return todosLosCompresores().find(eq => norm(eq.modelo).includes(q)) || null;
}

/** Recomienda un secador KRATTO que cubra el CFM del compresor (para aire seco). */
function recomendarSecador(cfmRequerido) {
  const margen = 1.10;
  return CATALOGO.KRATTO.secadores
    .filter(s => s.caudal_cfm >= cfmRequerido * margen)
    .sort((a, b) => a.caudal_cfm - b.caudal_cfm)[0] || null;
}

export {
  CATALOGO,
  todosLosCompresores,
  recomendarPorCFM,
  elegirMarca,
  buscarModelo,
  recomendarSecador,
};
