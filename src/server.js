/**
 * server.js — Backend agéntico de Marco (IMACOMP)
 * ----------------------------------------------------------------
 * - Express + SSE streaming hacia el widget
 * - Anthropic API con prompt caching (system + tools cacheados)
 * - Tool use loop: Marco recomienda equipos y guarda leads
 * - Catálogo cargado directo desde catalogo.js (sin RAG)
 * - Notificación de lead por email (Nodemailer) + webhook CRM (dual-mode)
 *
 * Variables de entorno (.env):
 *   ANTHROPIC_API_KEY      (obligatoria)
 *   PORT                   (default 10000)
 *   ALLOWED_ORIGIN         (default *  — pon tu dominio en producción)
 *   MODEL                  (default claude-sonnet-4-6)
 *   # Email (opcional)
 *   SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS LEAD_TO LEAD_FROM
 *   # CRM (opcional)
 *   CRM_MODE = zapier | clientify | none   (default none)
 *   ZAPIER_WEBHOOK_URL
 *   CLIENTIFY_TOKEN
 * ----------------------------------------------------------------
 */

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import {
  CATALOGO,
  recomendarPorCFM,
  elegirMarca,
  buscarModelo,
  recomendarSecador,
} from "./catalogo.js";

// ----------------------------------------------------------------
// Configuración
// ----------------------------------------------------------------
const PORT = process.env.PORT || 10000;
const MODEL = process.env.MODEL || "claude-sonnet-4-6";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const CRM_MODE = process.env.CRM_MODE || "none";
const MAX_TOOL_TURNS = 6; // tope de iteraciones del loop agéntico por mensaje

if (!ANTHROPIC_API_KEY) {
  console.error("✗ Falta ANTHROPIC_API_KEY. Configúrala en las variables de entorno.");
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: ALLOWED_ORIGIN }));

// ----------------------------------------------------------------
// System prompt de Marco
// ----------------------------------------------------------------
const SYSTEM_PROMPT = `Eres Marco, ingeniero y asesor técnico especialista en sistemas de aire comprimido y automatización industrial de IMACOMP. Atiendes a clientes en imacomp.cl y soluciones.imacomp.cl. Tu objetivo es identificar la necesidad del cliente, dar un diagnóstico inicial certero y perfilar oportunidades comerciales. Muchos clientes no son especialistas: eres empático, paciente y educativo.

LÍNEAS QUE REPRESENTAS (segmentación por potencia y tipo de aire):
- KRATTO: lubricado, PYME y talleres. 3 a 50 HP. Aire estándar.
- UNITED OSD: lubricado, industrial premium (joint venture Hitachi). 37 a 560 kW.
- MAXTOP: LIBRE DE ACEITE (pistón), ISO 8573-1 Clase 0. 5 a 32 HP. Farmacéutica, alimentos, dental, laboratorio.
- UNITED UDL: LIBRE DE ACEITE (tornillo), Clase 0. 37 a 355 kW. Farma/electrónica/nueva energía de gran caudal.

REGLA DE SEGMENTACIÓN: si el cliente requiere aire LIBRE DE ACEITE (farma, alimentos, dental, laboratorio, electrónica), recomienda MAXTOP (pequeño/mediano) o UNITED UDL (grande). Si el aire estándar es aceptable, recomienda KRATTO (hasta 50 HP) o UNITED OSD (industrial grande).

POSICIONAMIENTO: El diferenciador de IMACOMP es la auditoría energética de aire comprimido (ISO 11011): detectar fugas, pérdidas e ineficiencias para justificar mejoras. Los compresores de dos etapas UNITED (UDT) son los más eficientes energéticamente: úsalos como gancho hacia la auditoría.

REGLAS ESTRICTAS DE COMUNICACIÓN:
1. Concisión extrema: respuestas breves, precisas y directas. Sin saludos redundantes en cada mensaje.
2. Una sola pregunta por mensaje: PROHIBIDO hacer más de una (1) pregunta por mensaje. Guía paso a paso y espera la respuesta antes de avanzar.
3. Catálogos: cuando el cliente busque equipos, usa la herramienta recomendar_equipo (con el CFM estimado y si requiere aire libre de aceite) para entregar el modelo exacto con su caudal y presión reales. Para datos de un modelo específico usa buscar_modelo. NUNCA inventes especificaciones: si la herramienta no devuelve un equipo adecuado, ofrece que un ingeniero de IMACOMP confirme los valores exactos.
4. Formato TEXTO PLANO: escribe siempre en texto plano sin markdown. PROHIBIDO usar asteriscos, almohadillas, guiones bajos o cualquier símbolo de markdown. Para resaltar usa MAYÚSCULAS con moderación. Para listas usa guiones simples o números seguidos de punto.

CAPTURA DE LEAD: cuando el cliente muestre interés real (pide cotización, datos de contacto, quiere agendar), usa la herramienta guardar_lead con los datos que tengas (nombre, correo, teléfono, empresa, industria, necesidad técnica). No inventes datos: pide solo lo que falte, de a un dato por mensaje.`;

// ----------------------------------------------------------------
// Definición de herramientas (tools) para la API
// ----------------------------------------------------------------
const TOOLS = [
  {
    name: "recomendar_equipo",
    description:
      "Recomienda el o los compresores IMACOMP que cubren el caudal requerido por el cliente. " +
      "Devuelve, por marca aplicable, el equipo más ajustado que cubre el CFM (con margen de seguridad). " +
      "Usa esto cuando ya tengas un estimado de caudal (CFM) y sepas si el cliente necesita aire libre de aceite.",
    input_schema: {
      type: "object",
      properties: {
        cfm_requerido: {
          type: "number",
          description: "Caudal de aire requerido por el cliente, en CFM.",
        },
        libre_aceite: {
          type: "boolean",
          description:
            "true si el cliente requiere aire LIBRE DE ACEITE (farma, alimentos, dental, laboratorio, electrónica). false si aire estándar es aceptable.",
        },
      },
      required: ["cfm_requerido", "libre_aceite"],
    },
  },
  {
    name: "buscar_modelo",
    description:
      "Devuelve las especificaciones técnicas reales (potencia, caudal CFM, presión, salida) de un modelo específico por su nombre (ej: 'KRX 30', 'UDT 132', 'MT-OP6').",
    input_schema: {
      type: "object",
      properties: {
        modelo: {
          type: "string",
          description: "Nombre o parte del nombre del modelo a buscar.",
        },
      },
      required: ["modelo"],
    },
  },
  {
    name: "guardar_lead",
    description:
      "Guarda un lead calificado cuando el cliente muestra interés real (cotización, contacto, agendar). " +
      "Envía notificación al equipo de ventas de IMACOMP. Llama esto solo cuando tengas al menos nombre y un medio de contacto (correo o teléfono).",
    input_schema: {
      type: "object",
      properties: {
        nombre: { type: "string" },
        correo: { type: "string" },
        telefono: { type: "string" },
        empresa: { type: "string" },
        industria: { type: "string" },
        necesidad: {
          type: "string",
          description: "Resumen técnico de la necesidad y el equipo recomendado.",
        },
      },
      required: ["nombre"],
    },
  },
];

// ----------------------------------------------------------------
// Ejecución real de cada herramienta (handlers)
// ----------------------------------------------------------------
async function ejecutarHerramienta(nombre, input) {
  switch (nombre) {
    case "recomendar_equipo": {
      const { cfm_requerido, libre_aceite } = input;
      const marcaSugerida = elegirMarca(libre_aceite, cfm_requerido);
      const { objetivo_cfm, recomendaciones } = recomendarPorCFM(cfm_requerido, {
        libreAceite: libre_aceite,
      });
      // Secador sugerido para marcas lubricadas KRATTO (aire seco)
      let secador = null;
      if (!libre_aceite) secador = recomendarSecador(cfm_requerido);

      if (Object.keys(recomendaciones).length === 0) {
        return {
          ok: false,
          mensaje:
            "Ningún equipo estándar cubre ese caudal dentro del rango. Un ingeniero de IMACOMP debe confirmar una solución a medida.",
          objetivo_cfm,
        };
      }
      return {
        ok: true,
        objetivo_cfm,
        marca_sugerida: marcaSugerida,
        recomendaciones, // { MARCA: {modelo, caudal_cfm, potencia...} }
        secador_sugerido: secador,
      };
    }

    case "buscar_modelo": {
      const eq = buscarModelo(input.modelo);
      return eq
        ? { ok: true, equipo: eq }
        : {
            ok: false,
            mensaje:
              "No encontré ese modelo en el catálogo. Pide a un ingeniero de IMACOMP la ficha exacta.",
          };
    }

    case "guardar_lead": {
      const lead = {
        ...input,
        fecha: new Date().toISOString(),
        origen: "Marco (soluciones.imacomp.cl)",
      };
      const resultados = await Promise.allSettled([
        notificarLeadEmail(lead),
        enviarLeadCRM(lead),
      ]);
      const emailOk = resultados[0].status === "fulfilled" && resultados[0].value;
      const crmOk = resultados[1].status === "fulfilled" && resultados[1].value;
      console.log(`Lead capturado: ${lead.nombre} | email:${emailOk} crm:${crmOk}`);
      return {
        ok: true,
        mensaje:
          "Lead registrado. Un asesor de IMACOMP te contactará a la brevedad.",
        notificado: { email: emailOk, crm: crmOk },
      };
    }

    default:
      return { ok: false, mensaje: `Herramienta desconocida: ${nombre}` };
  }
}

// ----------------------------------------------------------------
// Notificación de lead por email (Nodemailer)
// ----------------------------------------------------------------
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function notificarLeadEmail(lead) {
  if (!transporter) return false;
  const to = process.env.LEAD_TO || "ventas@imacomp.cl";
  const from = process.env.LEAD_FROM || process.env.SMTP_USER;
  const cuerpo = Object.entries(lead)
    .map(([k, v]) => `${k}: ${v ?? "-"}`)
    .join("\n");
  try {
    await transporter.sendMail({
      from,
      to,
      subject: `Nuevo lead Marco: ${lead.nombre || "sin nombre"}`,
      text: cuerpo,
    });
    return true;
  } catch (e) {
    console.error("Error email lead:", e.message);
    return false;
  }
}

// ----------------------------------------------------------------
// Envío de lead al CRM (dual-mode: Zapier o Clientify directo)
// ----------------------------------------------------------------
async function enviarLeadCRM(lead) {
  try {
    if (CRM_MODE === "zapier" && process.env.ZAPIER_WEBHOOK_URL) {
      const r = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      return r.ok;
    }
    if (CRM_MODE === "clientify" && process.env.CLIENTIFY_TOKEN) {
      const r = await fetch("https://api.clientify.net/v1/contacts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.CLIENTIFY_TOKEN}`,
        },
        body: JSON.stringify({
          first_name: lead.nombre,
          emails: lead.correo ? [{ email: lead.correo }] : [],
          phones: lead.telefono ? [{ phone: lead.telefono }] : [],
          company_name: lead.empresa,
          tags: ["Marco", lead.industria].filter(Boolean),
        }),
      });
      return r.ok;
    }
    return false; // CRM_MODE=none
  } catch (e) {
    console.error("Error CRM lead:", e.message);
    return false;
  }
}

// ----------------------------------------------------------------
// Llamada a la API de Anthropic (no streaming, para el loop de tools)
// ----------------------------------------------------------------
async function llamarClaude(messages, { stream = false } = {}) {
  const body = {
    model: MODEL,
    max_tokens: 1024,
    stream,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" }, // cachea el system prompt
      },
    ],
    tools: TOOLS,
    messages,
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!stream) {
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Anthropic ${res.status}: ${t}`);
    }
    return res.json();
  }
  return res; // respuesta cruda para procesar el stream SSE
}

// ----------------------------------------------------------------
// Endpoint principal: /api/marco  (SSE streaming hacia el widget)
// ----------------------------------------------------------------
app.post("/api/marco", async (req, res) => {
  const historial = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!historial) {
    return res.status(400).json({ error: "Falta el arreglo 'messages'." });
  }

  // Cabeceras SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    let messages = [...historial];

    // --- FASE 1: loop agéntico (resuelve tools sin streamear) ---
    for (let turno = 0; turno < MAX_TOOL_TURNS; turno++) {
      const respuesta = await llamarClaude(messages, { stream: false });

      if (respuesta.stop_reason !== "tool_use") {
        // No hay más herramientas: streameamos esta respuesta final al usuario
        const textoFinal = respuesta.content
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("");
        // Enviamos el texto final en chunks para efecto streaming en el widget
        for (const trozo of partir(textoFinal, 60)) {
          send("delta", { text: trozo });
          await esperar(15);
        }
        send("done", { ok: true });
        return res.end();
      }

      // Hay tool_use: ejecutamos cada herramienta y devolvemos resultados
      messages.push({ role: "assistant", content: respuesta.content });
      const toolResults = [];
      for (const bloque of respuesta.content) {
        if (bloque.type !== "tool_use") continue;
        send("tool", { nombre: bloque.name }); // avisa al widget "pensando..."
        const resultado = await ejecutarHerramienta(bloque.name, bloque.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: bloque.id,
          content: JSON.stringify(resultado),
        });
      }
      messages.push({ role: "user", content: toolResults });
    }

    // Si se agotó el loop sin respuesta final
    send("delta", {
      text: "Necesito que un ingeniero de IMACOMP revise tu caso para darte una respuesta precisa. ¿Me dejas tu correo o teléfono?",
    });
    send("done", { ok: true });
    res.end();
  } catch (e) {
    console.error("Error en /api/marco:", e.message);
    send("error", { mensaje: "Ocurrió un problema. Intenta nuevamente." });
    res.end();
  }
});

// ----------------------------------------------------------------
// Utilidades
// ----------------------------------------------------------------
function partir(texto, n) {
  const out = [];
  for (let i = 0; i < texto.length; i += n) out.push(texto.slice(i, i + n));
  return out.length ? out : [""];
}
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Healthcheck
app.get("/health", (_req, res) =>
  res.json({ ok: true, modelo: MODEL, crm: CRM_MODE })
);

// Endpoint informativo del catálogo (útil para depurar)
app.get("/catalogo/resumen", (_req, res) => {
  const resumen = {};
  for (const marca of Object.keys(CATALOGO)) {
    resumen[marca] = {
      rango: CATALOGO[marca].rango,
      equipos: CATALOGO[marca].equipos.length,
    };
  }
  res.json(resumen);
});

app.listen(PORT, () => {
  console.log(`Marco agéntico escuchando en :${PORT}`);
  console.log(`Modelo: ${MODEL} | CRM: ${CRM_MODE}`);
});
