// ============================================================
// build-index.js — Construye el índice RAG desde tus PDFs
// Uso: node src/build-index.js
// Coloca tus PDFs (catálogos, manuales, casos) en ./docs/
// ============================================================
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { embed } from "./rag.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // npm i pdf-parse

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "..", "docs");
const OUT = path.join(__dirname, "..", "data", "knowledge-index.json");

// Trocea texto en fragmentos con solape (mejora recuperación)
function chunk(text, size = 900, overlap = 150) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks = [];
  for (let i = 0; i < clean.length; i += size - overlap) {
    chunks.push(clean.slice(i, i + size));
  }
  return chunks.filter((c) => c.length > 100);
}

async function main() {
  fs.mkdirSync(path.join(__dirname, "..", "data"), { recursive: true });
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));
  const index = [];

  for (const file of files) {
    console.log(`Procesando ${file}...`);
    const buffer = fs.readFileSync(path.join(DOCS_DIR, file));
    const { text } = await pdfParse(buffer);
    const fragmentos = chunk(text);

    for (const texto of fragmentos) {
      const embedding = await embed(texto);
      index.push({ fuente: file, texto, embedding });
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(index));
  console.log(`✓ Índice creado: ${index.length} fragmentos -> ${OUT}`);
}

main().catch(console.error);
