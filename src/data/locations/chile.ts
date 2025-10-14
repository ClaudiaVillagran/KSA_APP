
export type Region = { id: string; name: string };
export type Commune = { id: string; name: string; regionId: string; regionName: string };


export const regions: Region[] = [
  { id: "02", name: "Antofagasta" },
  { id: "15", name: "Arica y Parinacota" },
  { id: "03", name: "Atacama" },
  { id: "11", name: "Aysén" }, // abreviado (oficial: Aysén del General Carlos Ibáñez del Campo)
  { id: "08", name: "Biobío" },
  { id: "04", name: "Coquimbo" },
  { id: "09", name: "La Araucanía" },
  { id: "10", name: "Los Lagos" },
  { id: "14", name: "Los Ríos" },
  { id: "12", name: "Magallanes" }, // abreviado
  { id: "07", name: "Maule" },
  { id: "16", name: "Ñuble" },
  { id: "06", name: "O’Higgins" }, // abreviado (oficial: Libertador General Bernardo O’Higgins)
  { id: "13", name: "Santiago" },  // abreviado (oficial: Metropolitana de Santiago)
  { id: "01", name: "Tarapacá" },
  { id: "05", name: "Valparaíso" },
];

// === "Ciudades" (usamos tu tipo Commune para representarlas) ===
// Slugs tal como los compartiste (salvo deduplicación obvia).
export const communesFlat: Commune[] = [
  // Antofagasta
  { id: "antofagasta", name: "Antofagasta", regionId: "02", regionName: "Antofagasta" },

  // Arica y Parinacota
  { id: "arica", name: "Arica", regionId: "15", regionName: "Arica y Parinacota" },

  // Atacama (extra representativa)
  { id: "copiapo", name: "Copiapó", regionId: "03", regionName: "Atacama" },

  // Aysén (extra representativa)
  { id: "coyhaique", name: "Coyhaique", regionId: "11", regionName: "Aysén" },

  // Biobío (ya tenías)
  { id: "concepcion", name: "Concepción", regionId: "08", regionName: "Biobío" },
  { id: "nacimiento", name: "Nacimiento", regionId: "08", regionName: "Biobío" },
  { id: "tome", name: "Tomé", regionId: "08", regionName: "Biobío" },

  // Coquimbo (ya tenías)
  { id: "coquimbo", name: "Coquimbo", regionId: "04", regionName: "Coquimbo" },
  { id: "ovalle", name: "Ovalle", regionId: "04", regionName: "Coquimbo" },

  // La Araucanía (ya tenías)
  { id: "lautaro", name: "Lautaro", regionId: "09", regionName: "La Araucanía" },

  // Los Lagos (ya tenías)
  { id: "llanquihue", name: "Llanquihue", regionId: "10", regionName: "Los Lagos" },
  { id: "puerto-montt", name: "Puerto Montt", regionId: "10", regionName: "Los Lagos" },
  { id: "osorno", name: "Osorno", regionId: "10", regionName: "Los Lagos" },

  // Los Ríos (añadidas)
  { id: "valdivia", name: "Valdivia", regionId: "14", regionName: "Los Ríos" },
  { id: "la-union", name: "La Unión", regionId: "14", regionName: "Los Ríos" },

  // Magallanes (añadidas)
  { id: "punta-arenas", name: "Punta Arenas", regionId: "12", regionName: "Magallanes" },
  { id: "puerto-natales", name: "Puerto Natales", regionId: "12", regionName: "Magallanes" },

  // Maule (añadidas)
  { id: "talca", name: "Talca", regionId: "07", regionName: "Maule" },
  { id: "curico", name: "Curicó", regionId: "07", regionName: "Maule" },
  { id: "linares", name: "Linares", regionId: "07", regionName: "Maule" },

  // Ñuble (añadidas)
  { id: "chillan", name: "Chillán", regionId: "16", regionName: "Ñuble" },
  { id: "san-carlos", name: "San Carlos", regionId: "16", regionName: "Ñuble" },

  // O’Higgins (ya tenías)
  { id: "rancagua", name: "Rancagua", regionId: "06", regionName: "O’Higgins" },
  { id: "san-fernando", name: "San Fernando", regionId: "06", regionName: "O’Higgins" },
  { id: "machali", name: "Machalí", regionId: "06", regionName: "O’Higgins" },

  // Santiago (RM) (ya tenías)
  { id: "santiago", name: "Santiago", regionId: "13", regionName: "Santiago" },
  { id: "nunoa", name: "Ñuñoa", regionId: "13", regionName: "Santiago" },
  { id: "santiago-centro", name: "Santiago Centro", regionId: "13", regionName: "Santiago" },

  // Tarapacá (añadidas)
  { id: "iquique", name: "Iquique", regionId: "01", regionName: "Tarapacá" },
  { id: "alto-hospicio", name: "Alto Hospicio", regionId: "01", regionName: "Tarapacá" },

  // Valparaíso (ya tenías)
  { id: "limache", name: "Limache", regionId: "05", regionName: "Valparaíso" },
  { id: "vina-del-mar", name: "Viña del Mar", regionId: "05", regionName: "Valparaíso" }
];



// Construye secciones agrupadas por región para usar en <SectionList />
export function buildRegionSections() {
  const byRegion: Record<string, { title: string; regionId: string; data: Array<{ id: string; name: string }> }> = {};
  for (const r of regions) {
    byRegion[r.id] = { title: r.name, regionId: r.id, data: [] };
  }
  for (const c of communesFlat) {
    if (!byRegion[c.regionId]) {
      byRegion[c.regionId] = { title: c.regionName, regionId: c.regionId, data: [] };
    }
    byRegion[c.regionId].data.push({ id: c.id, name: c.name });
  }
  // ordena por nombre de región y por nombre de comuna
  const sections = Object.values(byRegion)
    .map((sec) => ({
      ...sec,
      data: sec.data.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
  return sections;
}

// Para conveniencia: secciones listas
export const regionSections = buildRegionSections();
