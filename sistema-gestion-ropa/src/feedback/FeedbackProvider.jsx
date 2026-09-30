import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react";
import { FeedbackContext } from "./context";

const DURACION_AVISO = 3500;
const MAX_AVISOS = 3;

export default function FeedbackProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const [confirmacion, setConfirmacion] = useState(null);
  const siguienteId = useRef(0);
  const botonConfirmar = useRef(null);

  const cerrarAviso = useCallback((id) => {
    setAvisos((lista) => lista.filter((a) => a.id !== id));
  }, []);

  const avisar = useCallback((mensaje, tipo = "exito") => {
    const id = ++siguienteId.current;
    setAvisos((lista) => [...lista, { id, mensaje, tipo }].slice(-MAX_AVISOS));
    setTimeout(() => cerrarAviso(id), DURACION_AVISO);
  }, [cerrarAviso]);

  const confirmar = useCallback((opciones) => {
    return new Promise((resolve) => {
      setConfirmacion({
        titulo: "¿Estás seguro?",
        textoConfirmar: "Confirmar",
        peligro: true,
        ...opciones,
        resolve
      });
    });
  }, []);

  const responder = useCallback((valor) => {
    confirmacion?.resolve(valor);
    setConfirmacion(null);
  }, [confirmacion]);

  useEffect(() => {
    if (!confirmacion) return;
    botonConfirmar.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") responder(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmacion, responder]);

  const valor = useMemo(() => ({ avisar, confirmar }), [avisar, confirmar]);

  return (
    <FeedbackContext.Provider value={valor}>
      {children}

      {confirmacion && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => responder(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmacion-titulo"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
          >
            <div className="p-5 flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                confirmacion.peligro ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 id="confirmacion-titulo" className="font-bold text-sm text-slate-900">{confirmacion.titulo}</h3>
                {confirmacion.mensaje && (
                  <p className="text-xs text-slate-600 mt-1">{confirmacion.mensaje}</p>
                )}
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                onClick={() => responder(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                ref={botonConfirmar}
                onClick={() => responder(true)}
                className={`px-4 py-2 text-white font-semibold rounded-xl cursor-pointer ${
                  confirmacion.peligro ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {confirmacion.textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        aria-live="polite"
        className="fixed z-[70] bottom-4 left-4 right-4 sm:left-auto sm:w-80 flex flex-col gap-2 pointer-events-none"
      >
        {avisos.map((a) => (
          <div
            key={a.id}
            role={a.tipo === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex items-start gap-2 p-3 rounded-xl shadow-lg border text-xs font-medium ${
              a.tipo === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            {a.tipo === "error"
              ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              : <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className="flex-1">{a.mensaje}</span>
            <button onClick={() => cerrarAviso(a.id)} aria-label="Cerrar aviso" className="opacity-60 hover:opacity-100 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}
