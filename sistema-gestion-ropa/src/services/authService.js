const KEYS = {
  USUARIOS: "se_tienda_usuarios",
  SESION: "se_tienda_session",
  SESION_LEGADA: "se_tienda_current_user"
};

export const PREGUNTAS_SEGURIDAD = [
  "¿Cómo se llamaba tu primera mascota?",
  "¿En qué ciudad naciste?",
  "¿Cuál es el nombre de tu mejor amigo de la infancia?",
  "¿Cuál fue tu primer colegio?",
  "¿Cuál es tu comida favorita?"
];

const SEED_USUARIOS = [
  {
    id: "usr-admin-1",
    nombre: "Matias Arango",
    email: "matias.arango@upb.edu.co",
    rol: "admin",
    password: "Admin2026*",
    pregunta: PREGUNTAS_SEGURIDAD[0],
    respuesta: "boutique"
  },
  {
    id: "usr-cajero-1",
    nombre: "Sebastián Cruz",
    email: "sebastian.cruz@upb.edu.co",
    rol: "cajero",
    password: "Cajero2026*",
    pregunta: PREGUNTAS_SEGURIDAD[0],
    respuesta: "boutique"
  },
  {
    id: "usr-cajero-2",
    nombre: "Federico Martínez",
    email: "federico.martinez@upb.edu.co",
    rol: "cajero",
    password: "Cajero2026*",
    pregunta: PREGUNTAS_SEGURIDAD[0],
    respuesta: "boutique"
  }
];

const MIN_PASSWORD = 8;

function readUsuarios() {
  try {
    const raw = localStorage.getItem(KEYS.USUARIOS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsuarios(usuarios) {
  localStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
}

function normalizarEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizarRespuesta(texto) {
  return String(texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hash(valor, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("El navegador no permite cifrado en este origen. Usa localhost o HTTPS.");
  }
  const data = new TextEncoder().encode(`${salt}:${valor}`);
  return bytesToHex(await crypto.subtle.digest("SHA-256", data));
}

function nuevoSalt() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

async function construirUsuario({ id, nombre, email, rol, password, pregunta, respuesta }) {
  const salt = nuevoSalt();
  return {
    id,
    nombre: nombre.trim(),
    email: normalizarEmail(email),
    rol,
    salt,
    passwordHash: await hash(password, salt),
    pregunta,
    respuestaHash: await hash(normalizarRespuesta(respuesta), salt),
    fechaCreacion: new Date().toISOString().split("T")[0]
  };
}

function publico(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };
}

function validarPassword(password) {
  if (!password || password.length < MIN_PASSWORD) {
    throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
  }
}

export async function initUsuarios() {
  localStorage.removeItem(KEYS.SESION_LEGADA);
  if (readUsuarios().length > 0) return;
  const usuarios = [];
  for (const seed of SEED_USUARIOS) {
    usuarios.push(await construirUsuario(seed));
  }
  writeUsuarios(usuarios);
}

export function getSesion() {
  try {
    const raw = sessionStorage.getItem(KEYS.SESION);
    if (!raw) return null;
    const sesion = JSON.parse(raw);
    const existe = readUsuarios().find((u) => u.id === sesion.id);
    return existe ? publico(existe) : null;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  sessionStorage.removeItem(KEYS.SESION);
}

export async function iniciarSesion({ email, password, rolEsperado }) {
  const usuario = readUsuarios().find((u) => u.email === normalizarEmail(email));
  const error = new Error("Correo o contraseña incorrectos.");
  if (!usuario) throw error;
  if ((await hash(password, usuario.salt)) !== usuario.passwordHash) throw error;
  if (usuario.rol !== rolEsperado) {
    throw new Error(
      rolEsperado === "admin"
        ? "Esta cuenta no es de administrador. Usa el acceso de cajeros."
        : "Esta cuenta no es de cajero. Usa el acceso de administrador."
    );
  }
  sessionStorage.setItem(KEYS.SESION, JSON.stringify({ id: usuario.id }));
  return publico(usuario);
}

export function getCajeros() {
  return readUsuarios()
    .filter((u) => u.rol === "cajero")
    .map((u) => ({ ...publico(u), fechaCreacion: u.fechaCreacion }));
}

export async function crearCajero({ nombre, email, password, pregunta, respuesta }) {
  if (!nombre?.trim()) throw new Error("El nombre es obligatorio.");
  if (!/^\S+@\S+\.\S+$/.test(normalizarEmail(email))) throw new Error("Correo electrónico inválido.");
  validarPassword(password);
  if (!normalizarRespuesta(respuesta)) throw new Error("La respuesta de seguridad es obligatoria.");

  const usuarios = readUsuarios();
  if (usuarios.some((u) => u.email === normalizarEmail(email))) {
    throw new Error("Ya existe un usuario con ese correo.");
  }
  const nuevo = await construirUsuario({
    id: "usr-cajero-" + Date.now(),
    nombre,
    email,
    rol: "cajero",
    password,
    pregunta,
    respuesta
  });
  usuarios.push(nuevo);
  writeUsuarios(usuarios);
  return publico(nuevo);
}

export function eliminarCajero(id) {
  const usuarios = readUsuarios();
  const objetivo = usuarios.find((u) => u.id === id);
  if (!objetivo || objetivo.rol !== "cajero") {
    throw new Error("Solo se pueden eliminar cuentas de cajero.");
  }
  writeUsuarios(usuarios.filter((u) => u.id !== id));
}

export async function restablecerPasswordCajero(id, nuevaPassword) {
  validarPassword(nuevaPassword);
  const usuarios = readUsuarios();
  const objetivo = usuarios.find((u) => u.id === id);
  if (!objetivo || objetivo.rol !== "cajero") {
    throw new Error("Solo se puede restablecer la contraseña de cajeros.");
  }
  objetivo.passwordHash = await hash(nuevaPassword, objetivo.salt);
  writeUsuarios(usuarios);
}

export function getPreguntaRecuperacion(email, rolEsperado) {
  const usuario = readUsuarios().find((u) => u.email === normalizarEmail(email));
  if (!usuario || usuario.rol !== rolEsperado) {
    throw new Error("No encontramos una cuenta con ese correo en este acceso.");
  }
  return usuario.pregunta;
}

export async function recuperarPassword({ email, rolEsperado, respuesta, nuevaPassword }) {
  validarPassword(nuevaPassword);
  const usuarios = readUsuarios();
  const usuario = usuarios.find((u) => u.email === normalizarEmail(email) && u.rol === rolEsperado);
  if (!usuario) throw new Error("No encontramos una cuenta con ese correo en este acceso.");
  const hashRespuesta = await hash(normalizarRespuesta(respuesta), usuario.salt);
  if (hashRespuesta !== usuario.respuestaHash) throw new Error("La respuesta de seguridad no coincide.");
  usuario.passwordHash = await hash(nuevaPassword, usuario.salt);
  writeUsuarios(usuarios);
}
