// ============================================================
// server.js — Backend agéntico de Marco (IMACOMP)
// Loop de tool use + SSE streaming hacia el widget
// ============================================================
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { TOOLS } from "./tools.js";
import { ejecutarTool } from "./handlers.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://soluciones.imacomp.cl", "https://imacomp.cl"],
    methods: ["POST"],
  })
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6"; // buen balance costo/calidad para landing

const SYSTEM_PROMPT = `Eres Marco, asesor técnico de IMACOMP, empresa chilena especializada en soluciones integrales de aire comprimido.

LÍNEAS QUE REPRESENTAS:
- KRATTO: compresores para PYME y talleres.
- UNITED OSD-Hitachi: industrial premium, alta exigencia.
- MAXTOP: oil-free para farmacéutica y alimentos.

POSICIONAMIENTO: IMACOMP es protagonista en servicio e ingeniería. El diferenciador es la auditoría energética de aire comprimido (ISO 11011): detectar pérdidas, fugas e ineficiencias para justificar mejoras y venta de equipos.

TU MISIÓN en cada conversación:
1. Entender el caso del visitante con preguntas técnicas concretas (caudal, presión, horas de uso, industria, síntomas).
2. Usar buscar_conocimiento ANTES de dar especificaciones. Nunca inventes datos técnicos.
3. Aportar valor real: recomendar equipo, estimar ROI, dar diagnóstico preliminar.
4. Cuando detectes interés, ofrecer agendar una reunión técnica y capturar el lead.

REGLAS:
- Tono profesional, cercano, sin promesas absolutas de resultados.
- Antes de guardar_lead, pide confirmación al cliente y sus datos de contacto.
- El ciclo B2B es largo (30-180 días): tu meta es calificar y agendar, no cerrar a la fuerza.
- Responde en español de Chile, claro y directo. No uses jerga innecesaria.
- Si no sabes algo, ofrece que un ingeniero de IMACOMP lo revise.`;

const MAX_TURNS = 8; // tope de iteraciones del loop agéntico por mensaje

app.post("/api/marco", async (req, res) => {
  // El cliente envía el historial completo (sin estado en servidor)
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages debe ser un array" });
  }

  // Cabeceras SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const conversation = [...messages];

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const stream = anthropic.messages.stream({
        model: MODEL,
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: conversation,
      });

      // Stream de texto al usuario en tiempo real
      stream.on("text", (delta) => send("text", { delta }));

      const finalMsg = await stream.finalMessage();

      // ¿Claude pidió usar herramientas?
      const toolUses = finalMsg.content.filter((b) => b.type === "tool_use");

      // Guardamos la respuesta del asistente en el historial
      conversation.push({ role: "assistant", content: finalMsg.content });

      if (toolUses.length === 0) {
        // No hay tools: respuesta final, terminamos
        send("done", { messages: conversation });
        break;
      }

      // Ejecutamos cada tool y devolvemos resultados
      const toolResults = [];
      for (const tu of toolUses) {
        send("tool", { name: tu.name }); // feedback opcional al widget ("Calculando ROI…")
        const result = await ejecutarTool(tu.name, tu.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        });
      }

      conversation.push({ role: "user", content: toolResults });
      // El loop continúa: Claude verá los resultados y seguirá
    }
  } catch (err) {
    console.error("[Marco] error:", err);
    send("error", { message: "Tuvimos un problema técnico. Un ingeniero de IMACOMP puede ayudarte directamente." });
  } finally {
    res.end();
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Marco agéntico escuchando en :${PORT}`));
