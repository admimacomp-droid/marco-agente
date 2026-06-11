// ============================================================
// rag.js — Búsqueda semántica simple sobre la base técnica IMACOMP
// ============================================================
// Estrategia: índice en memoria con embeddings. Para tu escala
// (catálogos + manuales + casos) esto es más que suficiente y no
// necesitas una base vectorial dedicada.
//
// Flujo:
//   1. Una vez (script aparte): troceas tus PDFs en fragmentos y
//      generas embeddings -> guardas en knowledge-index.json
//   2. En runtime: embeddings de la consulta + similitud coseno
//
// Los embeddings se generan con la API de Voyage (recomendado por
// Anthropic) o cualquier proveedor. Aquí queda abstraído en embed().
// ============================================================
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, "..", "data", "knowledge-index.json");

let INDEX = null;

function loadIndex() {
  if (INDEX) return INDEX;
  if (!fs.existsSync(INDEX_PATH)) {
    console.warn("[RAG] knowledge-index.json no existe aún. Corre build-index.js");
    INDEX = [];
    return INDEX;
  }
  INDEX = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
  return INDEX;
}

// Genera embedding de un texto. Cambia el proveedor si usas otro.
export async function embed(text) {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: [text], model: "voyage-3-lite" }),
  });
  const data = await res.json();
  return data.data[0].embedding;
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function searchKnowledge(consulta, topK = 4) {
  const index = loadIndex();
  if (!index.length) return [];

  const q = await embed(consulta);
  const ranked = index
    .map((item) => ({ texto: item.texto, fuente: item.fuente, score: cosine(q, item.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((r) => r.score > 0.4); // umbral mínimo de relevancia

  return ranked.map(({ texto, fuente }) => ({ texto, fuente }));
}
