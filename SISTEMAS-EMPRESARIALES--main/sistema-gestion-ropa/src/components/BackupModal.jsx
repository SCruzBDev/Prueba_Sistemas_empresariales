import React, { useState } from "react";
import { Download, Upload, RotateCcw, X, Check, AlertTriangle, Database } from "lucide-react";
import { exportDataJSON, importDataJSON, resetToSeedData } from "../services/storageService";

export default function BackupModal({ isOpen, onClose, onDataChanged }) {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = () => {
    try {
      const json = exportDataJSON();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `respaldo_boutique_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setMessage("¡Respaldo descargado exitosamente!");
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setError("Error al exportar datos: " + err.message);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const success = importDataJSON(event.target.result);
        if (success) {
          setMessage("¡Datos restaurados correctamente!");
          onDataChanged();
          setTimeout(() => {
            setMessage(null);
            onClose();
          }, 1500);
        } else {
          setError("El archivo JSON no tiene un formato válido.");
        }
      } catch (err) {
        setError("Error al leer archivo: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas reiniciar todos los datos a la demostración inicial? Se perderán las ventas nuevas.")) {
      resetToSeedData();
      setMessage("Datos reiniciados al estado inicial.");
      onDataChanged();
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-sm">Respaldo y Gestión de Datos Locales</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Toda la información del sistema (prendas, ventas, clientes, proveedores) se almacena de forma segura en tu navegador (<strong>localStorage</strong>).
          </p>

          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Exportar */}
          <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors bg-slate-50/50">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-1">
              <Download className="w-4 h-4 text-indigo-600" />
              Descargar Respaldo JSON
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Guarda una copia de seguridad con todos los productos y ventas para no perder tu progreso.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar archivo .json
            </button>
          </div>

          {/* Importar */}
          <div className="p-4 border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors bg-slate-50/50">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-emerald-600" />
              Restaurar desde Respaldo
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Carga un archivo .json exportado previamente para recuperar o transferir datos a otro equipo.
            </p>
            <label className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Subir archivo .json
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset */}
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="w-full py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Datos de Demostración Iniciales
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
