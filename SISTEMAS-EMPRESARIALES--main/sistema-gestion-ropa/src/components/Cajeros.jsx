import React, { useState } from "react";
import { UserPlus, Trash2, KeyRound, X, Save, AlertCircle, UserCheck, Mail, Calendar } from "lucide-react";
import {
  PREGUNTAS_SEGURIDAD,
  crearCajero,
  eliminarCajero,
  restablecerPasswordCajero
} from "../services/authService";

const FORM_VACIO = {
  nombre: "",
  email: "",
  password: "",
  pregunta: PREGUNTAS_SEGURIDAD[0],
  respuesta: ""
};

const inputClass =
  "w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500";

export default function Cajeros({ cajeros, onCajerosUpdated }) {
  const [modal, setModal] = useState(null); // null | "crear" | { tipo: "clave", cajero }
  const [form, setForm] = useState(FORM_VACIO);
  const [nuevaClave, setNuevaClave] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cerrarModal = () => {
    setModal(null);
    setError("");
    setGuardando(false);
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setError("");
    setModal("crear");
  };

  const abrirClave = (cajero) => {
    setNuevaClave("");
    setError("");
    setModal({ tipo: "clave", cajero });
  };

  const guardar = async (accion) => {
    setError("");
    setGuardando(true);
    try {
      await accion();
      onCajerosUpdated();
      cerrarModal();
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  };

  const handleCrear = (e) => {
    e.preventDefault();
    guardar(() => crearCajero(form));
  };

  const handleClave = (e) => {
    e.preventDefault();
    guardar(() => restablecerPasswordCajero(modal.cajero.id, nuevaClave));
  };

  const handleEliminar = (cajero) => {
    if (!window.confirm(`¿Eliminar la cuenta de ${cajero.nombre}? Sus ventas pasadas se conservan en el historial.`)) return;
    try {
      eliminarCajero(cajero.id);
      onCajerosUpdated();
    } catch (err) {
      window.alert(err.message);
    }
  };

  const errorBox = error && (
    <div role="alert" className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestión de Cajeros</h2>
          <p className="text-xs text-slate-500">
            Crea o elimina las cuentas que pueden ingresar al punto de venta.
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo cajero
        </button>
      </div>

      {cajeros.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-400">
          No hay cajeros registrados. Crea el primero con el botón "Nuevo cajero".
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cajeros.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-900 truncate">{c.nombre}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <Mail className="w-3 h-3 shrink-0" />
                    {c.email}
                  </div>
                </div>
              </div>
              {c.fechaCreacion && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  Creado el {c.fechaCreacion}
                </div>
              )}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => abrirClave(c)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Restablecer clave
                </button>
                <button
                  onClick={() => handleEliminar(c)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === "crear" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form onSubmit={handleCrear} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Nuevo cajero</h3>
              <button type="button" onClick={cerrarModal} className="p-1 hover:bg-slate-800 rounded-lg cursor-pointer" aria-label="Cerrar">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              {errorBox}
              <label className="block font-semibold text-slate-700">
                Nombre completo
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputClass} />
              </label>
              <label className="block font-semibold text-slate-700">
                Correo electrónico
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </label>
              <label className="block font-semibold text-slate-700">
                Contraseña inicial (mínimo 8 caracteres)
                <input type="password" required autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
              </label>
              <label className="block font-semibold text-slate-700">
                Pregunta de seguridad (para recuperar la clave)
                <select value={form.pregunta} onChange={(e) => setForm({ ...form, pregunta: e.target.value })} className={inputClass}>
                  {PREGUNTAS_SEGURIDAD.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="block font-semibold text-slate-700">
                Respuesta
                <input required autoComplete="off" value={form.respuesta} onChange={(e) => setForm({ ...form, respuesta: e.target.value })} className={inputClass} />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={cerrarModal} className="px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-60 cursor-pointer">
                  <Save className="w-4 h-4" />
                  {guardando ? "Guardando..." : "Crear cajero"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {modal && modal.tipo === "clave" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form onSubmit={handleClave} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Restablecer clave de {modal.cajero.nombre}</h3>
              <button type="button" onClick={cerrarModal} className="p-1 hover:bg-slate-800 rounded-lg cursor-pointer" aria-label="Cerrar">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              {errorBox}
              <label className="block font-semibold text-slate-700">
                Nueva contraseña (mínimo 8 caracteres)
                <input type="password" required autoFocus autoComplete="new-password" value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} className={inputClass} />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={cerrarModal} className="px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-60 cursor-pointer">
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
