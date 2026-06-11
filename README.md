# Marco Agéntico — IMACOMP

Asesor técnico con IA agéntica para `soluciones.imacomp.cl`. Evoluciona el Marco actual: ahora **ejecuta acciones** (recomienda equipos, estima ROI, diagnostica, guarda leads en CRM y agenda reuniones) además de conversar.

## Arquitectura

```
Visitante → Widget (SSE) → server.js → Claude API (tool use loop)
                                            ↓ cuando Claude pide una tool
                                        handlers.js ejecuta:
                                          · buscar_conocimiento → rag.js (catálogos)
                                          · recomendar_equipo
                                          · estimar_roi
                                          · diagnostico_preliminar
                                          · guardar_lead → Clientify / Zapier
                                          · agendar_reunion → Google Calendar
```

El "loop agéntico" está en `server.js`: Claude responde, si pide herramientas el backend las ejecuta y le devuelve resultados, y Claude continúa hasta tener respuesta final — todo dentro de una conversación fluida.

## Instalación

```bash
npm install
cp .env.example .env   # completa tus claves
```

## CRM (Clientify)
La API de Clientify **requiere plan enterprise**. Dos opciones:
- `CRM_MODE=clientify` → API directa (`api.clientify.net/v1/contacts/`, header `Authorization: Token ...`). Solo si tienes enterprise.
- `CRM_MODE=zapier` → webhook de Zapier/Make (recomendado si no eres enterprise). Es la ruta que el propio Clientify sugiere. Crea un Zap "Webhooks → Clientify: Create Contact" y pega la URL en `ZAPIER_WEBHOOK_URL`.

## Base de conocimiento (RAG)
1. Crea carpeta `docs/` y coloca tus PDFs: catálogos KRATTO/UNITED/MAXTOP, manual RecondOil, casos (MACO, etc.).
2. Completa `VOYAGE_API_KEY` (embeddings).
3. Ejecuta: `npm run build-index` → genera `data/knowledge-index.json`.

## Google Calendar
Crea una cuenta de servicio en Google Cloud, habilita Calendar API, comparte tu calendario de ventas con el email de la cuenta de servicio (o usa domain-wide delegation). Completa las variables `GCAL_*`.

## Correr
```bash
npm start          # producción
npm run dev        # con --watch
```

## Widget
Edita `marco-widget.html`: cambia `const API = "https://TU-BACKEND.com/api/marco"` por tu URL real. Pega el bloque completo antes de `</body>` en tu landing.

## Despliegue sugerido
Render, Railway o un VPS con Node 18+. Asegúrate de que el host soporte **respuestas en streaming** (SSE) — evita serverless con timeouts cortos para el endpoint `/api/marco`.

## Costos a vigilar
- API Claude: usa `claude-sonnet-4-6` (buen balance). El loop puede hacer 2-4 llamadas por mensaje cuando usa tools.
- Embeddings: solo al construir el índice (una vez) + una llamada por consulta RAG.
- Pon un tope de mensajes/sesión si temes abuso.
```
