import React from "react";
import { ShoppingBag, ShieldCheck, UserCheck, ChevronRight } from "lucide-react";

export default function Acceso() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8 text-white">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight tracking-tight">BOUTIQUE POS</h1>
            <p className="text-xs text-indigo-400 font-medium tracking-wide uppercase">Gestión de Moda</p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mb-6">¿Cómo quieres ingresar?</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <a href="#/admin" className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl p-6 transition-colors">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
            <h2 className="font-bold text-white text-sm mb-1">Administrador</h2>
            <p className="text-xs text-slate-400 mb-4">Inventario, reportes, proveedores y gestión de cajeros.</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
              Ingresar <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>

          <a href="#/cajero" className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl p-6 transition-colors">
            <UserCheck className="w-8 h-8 text-amber-400 mb-3" />
            <h2 className="font-bold text-white text-sm mb-1">Cajero</h2>
            <p className="text-xs text-slate-400 mb-4">Punto de venta, clientes y tus ventas.</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
              Ingresar <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
