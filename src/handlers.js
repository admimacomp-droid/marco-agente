// ============================================================
// handlers.js — Ejecución real de cada herramienta
// ============================================================
import { google } from "googleapis";
import { searchKnowledge } from "./rag.js";
import { calcularConsumo } from "./consumo.js";

// ----- Catálogo simplificado para recomendación (ajusta a tu realidad) -----
const LINEAS = {
  KRATTO: { rango_cfm: [5, 150], segmento: "PYME / taller", oil_free: false },
  UNITED: { rango_cfm: [100, 1500], segmento: "Industrial premium", oil_free: false },
  MAXTOP: { rango_cfm: [20, 800], segmento: "Oil-free farma/alimentos", oil_free: true },
};

// ============================================================
// 1. buscar_conocimiento (RAG)
// ============================================================
async function buscarConocimiento({ consulta }) {
  const fragmentos = await searchKnowledge(consulta, 4);
  if (!fragmentos.length) {
    return { encontrado: false, mensaje: "Sin coincidencias en la base técnica. No inventar datos." };
  }
  return { encontrado: true, fragmentos };
}

// ============================================================
// 2. recomendar_equipo
// ============================================================
async function recomendarEquipo(args) {
  const { caudal_requerido_cfm, requiere_oil_free, industria, presion_bar } = args;

  let candidatas = Object.entries(LINEAS);
  if (requiere_oil_free) candidatas = candidatas.filter(([, l]) => l.oil_free);

  if (caudal_requerido_cfm) {
    candidatas = candidatas.filter(
      ([, l]) => caudal_requerido_cfm >= l.rango_cfm[0] && caudal_requerido_cfm <= l.rango_cfm[1]
    );
  }

  const recomendada = candidatas[0]?.[0] ?? "UNITED";
  return {
    linea_recomendada: recomendada,
    detalle: LINEAS[recomendada],
    nota: `Recomendación preliminar para sector ${industria}${presion_bar ? `, ${presion_bar} bar` : ""}. ` +
          `Sujeta a validación técnica de IMACOMP. Usa buscar_conocimiento para el modelo específico.`,
  };
}

// ============================================================
// 3. estimar_roi
// ============================================================
async function estimarRoi(args) {
  const {
    potencia_actual_hp,
    horas_operacion_dia,
    dias_operacion_mes = 26,
    costo_kwh_clp = 150,
  } = args;

  const kw = potencia_actual_hp * 0.7457;
  const kwhMes = kw * horas_operacion_dia * dias_operacion_mes;
  const costoMensual = kwhMes * costo_kwh_clp;

  // Rangos conservadores de ahorro típicos de auditoría de aire comprimido
  const ahorroMin = 0.15;
  const ahorroMax = 0.30;

  return {
    consumo_estimado_kwh_mes: Math.round(kwhMes),
    costo_energetico_mensual_clp: Math.round(costoMensual),
    ahorro_estimado_mensual_clp: {
      conservador: Math.round(costoMensual * ahorroMin),
      optimista: Math.round(costoMensual * ahorroMax),
    },
    rango_ahorro: "15% a 30% (rango típico detectado en auditorías ISO 11011)",
    descargo: "Estimación preliminar. El ahorro real se determina con una auditoría formal en planta.",
  };
}

// ============================================================
// 4. diagnostico_preliminar
// ============================================================
async function diagnosticoPreliminar({ sintomas = [], antiguedad_equipo_anios }) {
  const banderas = [];
  const txt = sintomas.join(" ").toLowerCase();

  if (txt.includes("no para") || txt.includes("siempre encendido"))
    banderas.push("Posible sobredimensionamiento o fugas significativas en la red.");
  if (txt.includes("caída") || txt.includes("caida") || txt.includes("presión") || txt.includes("presion"))
    banderas.push("Caídas de presión: posible red subdimensionada o filtros saturados.");
  if (txt.includes("fuga") || txt.includes("silba") || txt.includes("ruido"))
    banderas.push("Fugas audibles: en una planta promedio representan 20-30% del consumo.");
  if (txt.includes("agua") || txt.includes("humedad") || txt.includes("aceite"))
    banderas.push("Presencia de agua/aceite: revisar secado y calidad de aire.");
  if (antiguedad_equipo_anios && antiguedad_equipo_anios > 8)
    banderas.push(`Equipo de ${antiguedad_equipo_anios} años: probable pérdida de eficiencia vs tecnología actual.`);

  if (!banderas.length)
    banderas.push("Sin banderas críticas evidentes; una auditoría confirmaría el estado real.");

  return {
    hallazgos_preliminares: banderas,
    recomendacion: "Auditoría de aire comprimido ISO 11011 para cuantificar pérdidas y oportunidades de ahorro.",
    descargo: "Diagnóstico orientativo basado en síntomas reportados, no sustituye medición en terreno.",
  };
}

// ============================================================
// 5. guardar_lead — Clienty/Clientify API o webhook Zapier
// ============================================================
async function guardarLead(args) {
  const mode = process.env.CRM_MODE || "zapier"; // "clientify" | "zapier"

  if (mode === "clientify") {
    // API directa (requiere plan enterprise + CLIENTIFY_API_KEY)
    const res = await fetch("https://api.clientify.net/v1/contacts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.CLIENTIFY_API_KEY}`,
      },
      body: JSON.stringify({
        first_name: args.nombre,
        company: args.empresa || "",
        email: args.email || "",
        phone: args.telefono || "",
        addresses: args.ciudad ? [{ city: args.ciudad }] : [],
        tags: ["landing-marco", `interes-${args.nivel_interes || "tibio"}`],
        summary: args.resumen_tecnico,
        source: "soluciones.imacomp.cl - Marco IA",
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return { guardado: false, error: `Clientify ${res.status}: ${t.slice(0, 200)}` };
    }
    return { guardado: true, crm: "clientify" };
  }

  // Webhook Zapier/Make (no requiere enterprise) — pega tu URL en ZAPIER_WEBHOOK_URL
  const res = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...args, fuente: "soluciones.imacomp.cl - Marco IA", fecha: new Date().toISOString() }),
  });
  return { guardado: res.ok, crm: "zapier" };
}

// ============================================================
// 6. agendar_reunion — Google Calendar
// ============================================================
async function agendarReunion(args) {
  const auth = new google.auth.JWT({
    email: process.env.GCAL_SA_EMAIL,
    key: (process.env.GCAL_SA_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
    subject: process.env.GCAL_IMPERSONATE || undefined, // si usas domain-wide delegation
  });
  const calendar = google.calendar({ version: "v3", auth });

  const inicio = new Date(args.fecha_hora_iso);
  const fin = new Date(inicio.getTime() + 45 * 60 * 1000); // 45 min

  const event = await calendar.events.insert({
    calendarId: process.env.GCAL_CALENDAR_ID || "primary",
    sendUpdates: "all",
    requestBody: {
      summary: args.tema || `Reunión técnica IMACOMP — ${args.nombre}`,
      description: `Reunión solicitada vía Marco (soluciones.imacomp.cl).\nCliente: ${args.nombre}`,
      start: { dateTime: inicio.toISOString(), timeZone: "America/Santiago" },
      end: { dateTime: fin.toISOString(), timeZone: "America/Santiago" },
      attendees: [{ email: args.email }],
      conferenceData: {
        createRequest: { requestId: `marco-${Date.now()}`, conferenceSolutionKey: { type: "hangoutsMeet" } },
      },
    },
    conferenceDataVersion: 1,
  });

  return {
    agendado: true,
    enlace: event.data.htmlLink,
    meet: event.data.hangoutLink || null,
    fecha: args.fecha_hora_iso,
  };
}

// ============================================================
// Router central
// ============================================================
export async function ejecutarTool(name, input) {
  try {
    switch (name) {
      case "buscar_conocimiento": return await buscarConocimiento(input);
      case "recomendar_equipo":   return await recomendarEquipo(input);
      case "estimar_roi":         return await estimarRoi(input);
      case "diagnostico_preliminar": return await diagnosticoPreliminar(input);
      case "guardar_lead":        return await guardarLead(input);
      case "calcular_consumo":    return calcularConsumo(input);
      case "agendar_reunion":     return await agendarReunion(input);
      default: return { error: `Tool desconocida: ${name}` };
    }
  } catch (err) {
    return { error: `Fallo ejecutando ${name}: ${err.message}` };
  }
}
