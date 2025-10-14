export const fmtCLP = (n: number | null | undefined) => {
  if (typeof n === "number" && isFinite(n)) {
    // retorna $24.990 con locale chileno
    return `$${n.toLocaleString("es-CL")}`;
  }
  return ""; // o "—"
};

export const fmtNumber = (n: number | null | undefined, fallback = "0") => {
  if (typeof n === "number" && isFinite(n)) return n.toLocaleString("es-CL");
  return fallback;
};

export const fmtDate = (ts?: { toDate?: () => Date } | null, withTime = false) => {
  if (!ts?.toDate) return ""; // o "—"
  const d = ts.toDate();
  return withTime
    ? d.toLocaleString("es-CL")
    : d.toLocaleDateString("es-CL");
};
