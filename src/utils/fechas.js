const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const dos = (n) => String(n).padStart(2, "0");

export function ahoraLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())} ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

// Acepta "YYYY-MM-DD HH:mm" y el formato antiguo de toLocaleString("es-CO"): "30/9/2026, 1:35:46 a. m."
export function parseFecha(valor) {
  const texto = String(valor || "");

  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  if (iso) {
    const [, y, m, d, h = "0", min = "0"] = iso;
    return new Date(+y, +m - 1, +d, +h, +min);
  }

  const local = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*([ap])?)?/i);
  if (local) {
    const [, d, m, y, h = "0", min = "0", meridiano] = local;
    let hora = +h;
    if (meridiano) {
      const pm = meridiano.toLowerCase() === "p";
      if (pm && hora < 12) hora += 12;
      if (!pm && hora === 12) hora = 0;
    }
    return new Date(+y, +m - 1, +d, hora, +min);
  }

  return null;
}

export function formatearFecha(valor) {
  const d = parseFecha(valor);
  if (!d) return String(valor || "");
  const h12 = d.getHours() % 12 || 12;
  const meridiano = d.getHours() < 12 ? "a. m." : "p. m.";
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}, ${h12}:${dos(d.getMinutes())} ${meridiano}`;
}

export function fechaISO(valor) {
  const d = parseFecha(valor);
  return d ? `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}` : "";
}
