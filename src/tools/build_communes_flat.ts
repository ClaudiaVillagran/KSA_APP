// tools/build_communes_flat.ts
import fs from "fs";
import path from "path";

// Ajusta la ruta de entrada/salida:
const INPUT = path.resolve(__dirname, "../src/data/comunities/chile_communes_by_region.json");
const OUTPUT = path.resolve(__dirname, "../src/data/comunities/chile_communes_flat.json");

type Region = {
  region: string;
  provincias: { provincia: string; comunas: string[] }[];
};

// Lee el jerárquico
const regions: Region[] = JSON.parse(fs.readFileSync(INPUT, "utf8"));

// Aplana a "Comuna, Región"
const flat: string[] = [];
for (const r of regions) {
  for (const p of r.provincias) {
    for (const c of p.comunas) {
      flat.push(`${c}, ${r.region.replace(/^Región de\s+/i, "").replace(/^Región\s+/i, "")}`);
      // opcional: si quieres mantener el "Región de ..." quita el replace
      // flat.push(`${c}, ${r.region}`);
    }
  }
}

// Orden alfabético (opcional)
flat.sort((a, b) => a.localeCompare(b, "es"));

// Escribe el JSON plano
fs.writeFileSync(OUTPUT, JSON.stringify(flat, null, 2), "utf8");
// console.log(`OK: generado ${OUTPUT} con ${flat.length} comunas`);
